import { GITHUB_REPO, getReleaseUrl } from './github.js';

export function formatSize(bytes) {
  if (!bytes) return '';
  const mb = (bytes / (1024 * 1024)).toFixed(1);
  return `${mb} MB`;
}

export function getExtensionLabel(filename) {
  if (filename.endsWith('.deb')) return 'deb';
  if (filename.endsWith('.rpm')) return 'rpm';
  if (filename.endsWith('.AppImage')) return 'AppImage';
  if (filename.endsWith('.dmg')) return 'dmg';
  if (filename.endsWith('.zip')) return 'zip';
  if (filename.endsWith('.exe')) return 'exe';
  return '';
}

const linuxArchMap = { arm64: ['aarch64', 'arm64'], x64: ['x86_64', 'amd64'] };
const macArchMap = { arm64: ['arm64'], x64: ['x64'] };
const extPrefs = {
  mac: ['.dmg', '.zip'],
  win: ['.exe'],
  linux: ['.deb', '.rpm', '.AppImage']
};

function getArchNames(os, arch) {
  if (os === 'linux') return linuxArchMap[arch] || ['x86_64'];
  if (os === 'mac') return macArchMap[arch] || ['x64'];
  return [];
}

function findBestAsset(assets, os, arch) {
  const archNames = getArchNames(os, arch);
  const prefs = extPrefs[os] || ['.exe'];

  for (const ext of prefs) {
    const match = assets.find(a =>
      a.name.includes(os) &&
      archNames.some(name => a.name.includes(name)) &&
      a.name.endsWith(ext)
    );
    if (match) return match;
  }

  if (os === 'win') {
    return assets.find(a => a.name.includes('win') && a.name.endsWith('.exe'));
  }

  return null;
}

function findAlternativeAssets(assets, os, arch, excludeName) {
  const archNames = getArchNames(os, arch);

  if (os === 'win') {
    return assets.filter(a => a.name.includes('win') && a.name.endsWith('.exe') && a.name !== excludeName);
  }

  return assets.filter(a => {
    if (!a.name.includes(os)) return false;
    if (!archNames.some(name => a.name.includes(name))) return false;
    return a.name !== excludeName;
  });
}

export function getDownloadLink(assets, os, arch) {
  const match = findBestAsset(assets, os, arch);
  if (match) {
    return {
      url: match.browser_download_url,
      size: formatSize(match.size),
      sizeBytes: match.size,
      name: match.name,
      label: getExtensionLabel(match.name)
    };
  }
  return null;
}

export function getAlternativeLinks(assets, os, arch, primaryName) {
  return findAlternativeAssets(assets, os, arch, primaryName).map(a => ({
    url: a.browser_download_url,
    size: formatSize(a.size),
    sizeBytes: a.size,
    name: a.name,
    label: getExtensionLabel(a.name)
  }));
}

export function getDownloadButtonHTML(link) {
  if (!link) {
    return `<a href="${getReleaseUrl()}" target="_blank" rel="noopener" class="download-btn">View Releases</a>`;
  }
  const sizeHtml = link.size ? `<span class="download-size">${link.size}</span>` : '';
  return `<a href="${link.url}" class="download-btn">Download ${sizeHtml}</a>`;
}

export function getAlternativeHTML(links) {
  if (links.length === 0) return '';
  let html = '<div class="download-alt-list">';
  html += '<span class="download-alt-label">Other formats:</span>';
  for (const link of links) {
    const size = link.size ? ` (${link.size})` : '';
    html += `<a href="${link.url}" class="download-alt-link">${link.label}${size}</a>`;
  }
  html += '</div>';
  return html;
}

export function getDownloadSectionHTML(assets, os, arch) {
  const primary = getDownloadLink(assets, os, arch);
  let html = getDownloadButtonHTML(primary);
  if (primary) {
    const alts = getAlternativeLinks(assets, os, arch, primary.name);
    html += getAlternativeHTML(alts);
  }
  return html;
}

export function renderDownloadButton(container, platform, release) {
  if (!release) {
    container.innerHTML = getDownloadButtonHTML(null);
    return;
  }
  container.innerHTML = getDownloadSectionHTML(release.assets || [], platform.os, platform.arch);
}
