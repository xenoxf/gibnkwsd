import { getPlatform, getPlatformLabel } from './platform.js';
import { fetchLatestRelease } from './github.js';
import { showOSBadge, showVersionBadge } from './ui.js';
import { renderDownloadButton } from './download.js';
import { renderChangelog } from './changelog.js';

export async function init() {
  const platform = getPlatform();
  showOSBadge(platform, getPlatformLabel(platform));

  const release = await fetchLatestRelease();
  showVersionBadge(release);

  const downloadMap = { mac: 'mac-download', win: 'win-download', linux: 'linux-download' };
  for (const [plat, id] of Object.entries(downloadMap)) {
    const container = document.getElementById(id);
    if (container) {
      renderDownloadButton(container, { os: plat, arch: platform.arch }, release);
    }
  }

  renderChangelog(release);
}
