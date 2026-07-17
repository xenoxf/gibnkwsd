export function parseChangelog(release) {
  if (!release) return null;

  const body = release.body || '';
  const lines = body.split('\n')
    .filter(l => l.trim().startsWith('-') || l.trim().startsWith('*'))
    .map(l => l.replace(/^[-*\s]+/, '').trim());

  if (lines.length === 0) {
    return { items: [], raw: body.slice(0, 200) };
  }

  return { items: lines.slice(0, 10) };
}

export function getChangelogHTML(release) {
  const parsed = parseChangelog(release);

  if (!release) {
    return '<p style="color: var(--text-muted); font-size: 0.9rem;">Unable to load changelog.</p>';
  }

  if (parsed.items.length === 0) {
    const text = parsed.raw || 'No changelog available.';
    return `<p style="color: var(--text-muted); font-size: 0.9rem;">${text}</p>`;
  }

  return parsed.items.map(text =>
    `<div class="changelog-item"><span class="changelog-bullet"></span><span class="changelog-text">${text}</span></div>`
  ).join('');
}

export function renderChangelog(release) {
  const container = document.getElementById('changelog-content');
  if (!container) return;
  container.innerHTML = getChangelogHTML(release);
}
