const GITHUB_REPO = 'xenoxf/openjunior';

function getPlatform() {
  const ua = navigator.userAgent;
  if (ua.includes('Mac OS')) return 'mac';
  if (ua.includes('Windows')) return 'win';
  if (ua.includes('Linux')) return 'linux';
  return 'unknown';
}

function getPlatformLabel(platform) {
  const labels = { mac: 'macOS', win: 'Windows', linux: 'Linux' };
  return labels[platform] || 'Unknown';
}

function getPlatformEmoji(platform) {
  const emojis = { mac: '🍎', win: '🪟', linux: '🐧' };
  return emojis[platform] || '';
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
  const filters = {
    mac: (a) => a.name.endsWith('.dmg') || a.name.endsWith('.dmg.gz'),
    win: (a) => a.name.endsWith('.exe') || a.name.endsWith('.exe.gz'),
    linux: (a) => a.name.endsWith('.AppImage') || a.name.endsWith('.deb') || a.name.includes('linux')
  };

  const filterFn = filters[platform] || (() => false);
  const match = assets.find(filterFn);

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
  el.innerHTML = `<span class="os-detection-badge">${emoji} Detected: ${label}</span>`;
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
      renderDownloadButton(container, plat, release);
    }
  }

  renderChangelog(release);
}

document.addEventListener('DOMContentLoaded', init);
