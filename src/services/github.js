export const GITHUB_REPO = 'xenoxf/Glenker';

export async function fetchLatestRelease() {
  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases/latest`);
    if (!res.ok) throw new Error(`GitHub API returned ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch release:', err);
    return null;
  }
}

export async function fetchReleases(limit = 5) {
  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases?per_page=${limit}`);
    if (!res.ok) throw new Error(`GitHub API returned ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch releases:', err);
    return [];
  }
}

export function getReleaseTag(release) {
  if (!release) return null;
  return release.tag_name.replace(/^v/, '');
}

export function getReleaseUrl() {
  return `https://github.com/${GITHUB_REPO}/releases`;
}
