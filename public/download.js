const GITHUB_REPO = 'xenoxf/openjunior';

function detectArchitecture() {
  const ua = navigator.userAgent;
  const platform = (navigator.platform || '').toLowerCase();

  if (/aarch64|arm64|ARM/i.test(ua) || /aarch64|arm/i.test(platform)) return 'arm64';
  if (/x86_64|x64|AMD64|Win64/i.test(ua) || /x86_64|x64/i.test(platform)) return 'x64';
  if (/x86|i[3-6]86/i.test(platform)) return 'x64';

  if (navigator.userAgentData && navigator.userAgentData.architecture) {
    const arch = navigator.userAgentData.architecture;
    if (/arm|aarch64/i.test(arch)) return 'arm64';
    if (/x86|amd64/i.test(arch)) return 'x64';
  }

  return 'x64';
}

function getPlatform() {
  const ua = navigator.userAgent;
  const arch = detectArchitecture();
  if (ua.includes('Mac OS')) return { os: 'mac', arch };
  if (ua.includes('Windows')) return { os: 'win', arch };
  if (ua.includes('Linux')) return { os: 'linux', arch };
  return { os: 'unknown', arch };
}

function getPlatformLabel(platform) {
  const labels = { mac: 'macOS', win: 'Windows', linux: 'Linux' };
  return labels[platform.os] || 'Unknown';
}

function getPlatformEmoji(platform) {
  const emojis = { mac: '🍎', win: '🪟', linux: '🐧' };
  return emojis[platform.os] || '';
}

async function fetchLatestRelease() {
  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases/latest`);
    if (!res.ok) throw new Error(`GitHub API returned ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch release:', err);
    return null;
  }
}

function formatSize(bytes) {
  if (!bytes) return '';
  const mb = (bytes / (1024 * 1024)).toFixed(1);
  return `${mb} MB`;
}

function renderDownloadButton(container, platform, release) {
  if (!release) {
    container.innerHTML = `<a href="https://github.com/${GITHUB_REPO}/releases" target="_blank" rel="noopener" class="download-btn">View Releases</a>`;
    return;
  }

  const assets = release.assets || [];
  const { os, arch } = platform;

  const linuxArchMap = { arm64: ['aarch64', 'arm64'], x64: ['x86_64', 'amd64'] };
  const macArchMap = { arm64: ['arm64'], x64: ['x64'] };
  const archNames = os === 'linux' ? (linuxArchMap[arch] || ['x86_64']) : (macArchMap[arch] || ['x64']);

  const getMatch = (platformOs, extPrefs) => {
    for (const ext of extPrefs) {
      const match = assets.find(a =>
        a.name.includes(platformOs) &&
        archNames.some(name => a.name.includes(name)) &&
        a.name.endsWith(ext)
      );
      if (match) return match;
    }
    return null;
  };

  let match = null;
  if (os === 'mac') {
    match = getMatch('mac', ['.dmg', '.zip']);
  } else if (os === 'linux') {
    match = getMatch('linux', ['.AppImage', '.deb', '.rpm']);
  } else if (os === 'win') {
    match = assets.find(a => a.name.includes('win') && a.name.endsWith('.exe'));
  }

  if (match) {
    const size = match.size ? `<span class="download-size">${formatSize(match.size)}</span>` : '';
    container.innerHTML = `<a href="${match.browser_download_url}" class="download-btn">Download ${size}</a>`;
  } else {
    container.innerHTML = `<a href="https://github.com/${GITHUB_REPO}/releases" target="_blank" rel="noopener" class="download-btn">Download</a>`;
  }
}

function renderChangelog(release) {
  const container = document.getElementById('changelog-content');
  if (!container) return;

  if (!release) {
    container.innerHTML = '<p style="color: var(--text-muted); font-size: 0.9rem;">Unable to load changelog.</p>';
    return;
  }

  const body = release.body || '';
  const lines = body.split('\n').filter(l => l.trim().startsWith('-') || l.trim().startsWith('*'));

  if (lines.length === 0) {
    container.innerHTML = `<p style="color: var(--text-muted); font-size: 0.9rem;">${body.slice(0, 200) || 'No changelog available.'}</p>`;
    return;
  }

  container.innerHTML = lines.slice(0, 10).map(line => {
    const text = line.replace(/^[-*\s]+/, '').trim();
    return `<div class="changelog-item"><span class="changelog-bullet"></span><span class="changelog-text">${text}</span></div>`;
  }).join('');
}

function showOSDetection(platform) {
  const el = document.getElementById('os-detection');
  if (!el) return;
  const label = getPlatformLabel(platform);
  const emoji = getPlatformEmoji(platform);
  const archLabel = platform.arch === 'arm64' ? 'ARM' : 'x86_64';
  el.innerHTML = `<span class="os-detection-badge">${emoji} Detected: ${label} (${archLabel})</span>`;
}

function showVersion(release) {
  const el = document.getElementById('version-info');
  if (!el) return;
  if (release) {
    el.innerHTML = `<span class="version-badge-text">v${release.tag_name.replace(/^v/, '')}</span>`;
  }
}

async function init() {
  const platform = getPlatform();
  showOSDetection(platform);

  const release = await fetchLatestRelease();
  showVersion(release);

  const downloadMap = { mac: 'mac-download', win: 'win-download', linux: 'linux-download' };
  for (const [plat, id] of Object.entries(downloadMap)) {
    const container = document.getElementById(id);
    if (container) {
      renderDownloadButton(container, { os: plat, arch: platform.arch }, release);
    }
  }

  renderChangelog(release);
}

document.addEventListener('DOMContentLoaded', init);
