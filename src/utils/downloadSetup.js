import { getPlatform, getPlatformLabel, getPlatformEmoji } from '../services/platform.js'
import { fetchLatestRelease, getReleaseTag } from '../services/github.js'
import { renderDownloadButton } from '../services/download.js'
import { renderChangelog } from '../services/changelog.js'

export async function init() {
  const platform = getPlatform()

  const osBadge = document.getElementById('osDetection')
  if (osBadge) {
    osBadge.innerHTML = `${getPlatformEmoji(platform)} ${getPlatformLabel(platform)} (${platform.arch === 'arm64' ? 'ARM' : 'x86_64'})`
  }

  const release = await fetchLatestRelease()

  const versionBadge = document.getElementById('versionBadge')
  if (versionBadge) {
    versionBadge.textContent = release ? `v${getReleaseTag(release)}` : 'Latest'
  }

  for (const plat of ['mac', 'win', 'linux']) {
    const container = document.getElementById(`${plat}-download`)
    if (container) renderDownloadButton(container, { os: plat, arch: platform.arch }, release)
  }

  renderChangelog(release)
}
