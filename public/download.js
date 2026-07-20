const GITHUB_REPO = "xenoxf/Glenker";

function detectArchitecture() {
  const ua = navigator.userAgent;
  const platform = (navigator.platform || "").toLowerCase();

  if (/aarch64|arm64|ARM/i.test(ua) || /aarch64|arm/i.test(platform))
    return "arm64";
  if (/x86_64|x64|AMD64|Win64/i.test(ua) || /x86_64|x64/i.test(platform))
    return "x64";
  if (/x86|i[3-6]86/i.test(platform)) return "x64";

  if (navigator.userAgentData && navigator.userAgentData.architecture) {
    const arch = navigator.userAgentData.architecture;
    if (/arm|aarch64/i.test(arch)) return "arm64";
    if (/x86|amd64/i.test(arch)) return "x64";
  }

  return platform;
}

function getPlatform() {
  const ua = navigator.userAgent;
  const arch = detectArchitecture();
  if (ua.includes("Mac OS")) return { os: "mac", arch };
  if (ua.includes("Windows")) return { os: "win", arch };
  if (ua.includes("Linux")) return { os: "linux", arch };
  return { os: "unknown", arch };
}

function getPlatformLabel(platform) {
  const labels = { mac: "macOS", win: "Windows", linux: "Linux" };
  return labels[platform.os] || "Unknown";
}

function getPlatformEmoji(platform) {
  const emojis = { mac: "🍎", win: "🪟", linux: "🐧" };
  return emojis[platform.os] || "";
}

async function fetchLatestRelease() {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`,
    );
    if (!res.ok) throw new Error(`GitHub API returned ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("Failed to fetch release:", err);
    return null;
  }
}

function formatSize(bytes) {
  if (!bytes) return "";
  const mb = (bytes / (1024 * 1024)).toFixed(1);
  return `${mb} MB`;
}

function getExtensionLabel(filename) {
  if (filename.endsWith(".deb")) return "deb";
  if (filename.endsWith(".rpm")) return "rpm";
  if (filename.endsWith(".AppImage")) return "AppImage";
  if (filename.endsWith(".dmg")) return "dmg";
  if (filename.endsWith(".zip")) return "zip";
  if (filename.endsWith(".exe")) return "exe";
  return "";
}

function renderDownloadButton(container, platform, release) {
  if (!release) {
    container.innerHTML = `<a href="https://discord.gg/ZYRSdnwwKA" target="_blank" rel="noopener noreferrer" class="download-fallback">Escríbenos en Discord</a>`;
    return;
  }

  const assets = release.assets || [];
  const { os, arch } = platform;

  const linuxArchMap = {
    arm64: ["aarch64", "arm64"],
    x64: ["x86_64", "amd64"],
  };
  const macArchMap = { arm64: ["arm64"], x64: ["x64"] };
  const archNames =
    os === "linux"
      ? linuxArchMap[arch] || ["x86_64"]
      : macArchMap[arch] || ["x64"];

  const linuxExtPrefs = [".deb", ".rpm", ".AppImage"];
  const macExtPrefs = [".dmg", ".zip"];
  const winExtPrefs = [".exe"];
  const extPrefs =
    os === "linux" ? linuxExtPrefs : os === "mac" ? macExtPrefs : winExtPrefs;

  const getMatch = (platformOs) => {
    for (const ext of extPrefs) {
      const match = assets.find(
        (a) =>
          a.name.includes(platformOs) &&
          archNames.some((name) => a.name.includes(name)) &&
          a.name.endsWith(ext),
      );
      if (match) return match;
    }
    return null;
  };

  let match = null;
  if (os === "mac" || os === "linux") {
    match = getMatch(os);
  } else if (os === "win") {
    match = assets.find(
      (a) => a.name.includes("win") && a.name.endsWith(".exe"),
    );
  }

  let html = "";
  if (match) {
    const size = match.size
      ? `<span class="download-size">${formatSize(match.size)}</span>`
      : "";
    html += `<a href="${match.browser_download_url}" class="download-btn" data-platform="${platform.os}">Descargar ${size}</a>`;
  } else {
    html += `<a href="https://discord.gg/ZYRSdnwwKA" target="_blank" rel="noopener noreferrer" class="download-fallback">Escríbenos en Discord</a>`;
  }

  const allMatching = assets
    .filter((a) => {
      if (os === "win")
        return a.name.includes("win") && a.name.endsWith(".exe");
      if (!a.name.includes(os)) return false;
      if (os === "linux")
        return archNames.some((name) => a.name.includes(name));
      if (os === "mac") return archNames.some((name) => a.name.includes(name));
      return false;
    })
    .filter((a) => match && a.name !== match.name);

  if (allMatching.length > 0) {
    html += '<div class="download-alt-list">';
    html += '<span class="download-alt-label">Other formats:</span>';
    for (const asset of allMatching) {
      const label = getExtensionLabel(asset.name);
      const size = asset.size ? ` (${formatSize(asset.size)})` : "";
      html += `<a href="${asset.browser_download_url}" class="download-alt-link">${label}${size}</a>`;
    }
    html += "</div>";
  }

  container.innerHTML = html;
}

function parseChangelogLines(body) {
  return body
    .split("\n")
    .filter((l) => l.trim().startsWith("-") || l.trim().startsWith("*"))
    .map((l) => l.replace(/^[-*\s]+/, "").trim())
    .filter((t) => t.length > 0)
    .slice(0, 10);
}

async function fetchChangelogFromRepo() {
  try {
    const res = await fetch(
      "https://raw.githubusercontent.com/xenoxf/Glenker/main/CHANGELOG.md",
    );
    if (!res.ok) throw new Error("CHANGELOG.md fetch failed");
    const text = await res.text();
    const blocks = text.split(/^##\s/m);
    for (let i = 1; i < blocks.length; i++) {
      const block = blocks[i];
      const items = parseChangelogLines(block);
      if (items.length > 0) {
        const versionMatch = block.match(/^\[?([\d.]+)/);
        return { items, version: versionMatch ? versionMatch[1] : null };
      }
    }
    return null;
  } catch (err) {
    console.error("Failed to fetch CHANGELOG.md:", err);
    return null;
  }
}

async function renderChangelog(release) {
  const container = document.getElementById("changelog-content");
  if (!container) return;

  let items = release && release.body ? parseChangelogLines(release.body) : [];
  let source = "release";

  if (items.length === 0) {
    const fromRepo = await fetchChangelogFromRepo();
    if (fromRepo) {
      items = fromRepo.items;
      source = "repo";
    }
  }

  if (items.length === 0) {
    container.innerHTML =
      '<p class="changelog-empty">No pudimos cargar el changelog ahora mismo. <a href="https://discord.gg/ZYRSdnwwKA" target="_blank" rel="noopener noreferrer">Escríbenos en Discord</a> y te pasamos las novedades.</p>';
    return;
  }

  container.innerHTML = items
    .map(
      (text) =>
        `<div class="changelog-item"><span class="changelog-bullet"></span><span class="changelog-text">${text}</span></div>`,
    )
    .join("");

  container.innerHTML +=
    `<div class="changelog-more"><a href="https://github.com/xenoxf/Glenker/releases" target="_blank" rel="noopener noreferrer">Ver todas las versiones en GitHub</a></div>`;
}

function showOSDetection(platform) {
  const el = document.getElementById("os-detection");
  if (!el) return;
  const label = getPlatformLabel(platform);
  const emoji = getPlatformEmoji(platform);
  const archLabel = platform.arch === "arm64" ? "ARM" : "x86_64";
  el.innerHTML = `<span class="os-detection-badge">${emoji} Detected: ${label} (${archLabel})</span>`;
}

function showVersion(release) {
  const el = document.getElementById("version-info");
  if (!el) return;
  if (release) {
    el.innerHTML = `<span class="version-badge-text">v${release.tag_name.replace(/^v/, "")}</span>`;
  }
}

async function init() {
  const platform = getPlatform();
  showOSDetection(platform);

  const release = await fetchLatestRelease();
  showVersion(release);

  const downloadMap = {
    mac: "mac-download",
    win: "win-download",
    linux: "linux-download",
  };
  for (const [plat, id] of Object.entries(downloadMap)) {
    const container = document.getElementById(id);
    if (container) {
      renderDownloadButton(
        container,
        { os: plat, arch: platform.arch },
        release,
      );
    }
  }

  renderChangelog(release);
}

document.addEventListener("DOMContentLoaded", init);
