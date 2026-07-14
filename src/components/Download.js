import { SITE } from '../services/config.js'

export function init() {
  const section = document.createElement('section')
  section.className = 'download-section'
  section.id = 'downloadSection'

  section.innerHTML = `
    <h2 class="fade-in">Download ${SITE.name}</h2>
    <p class="fade-in">Available for macOS, Windows, and Linux.</p>
    <div class="download-info">
      <span class="os-detection-badge" id="osDetection">Detecting OS...</span>
      <span class="version-badge" id="versionBadge">Loading version...</span>
    </div>
    <div class="download-buttons">
      <div id="mac-download" class="download-btn-placeholder">Loading macOS download...</div>
      <div id="win-download" class="download-btn-placeholder">Loading Windows download...</div>
      <div id="linux-download" class="download-btn-placeholder">Loading Linux download...</div>
    </div>
  `

  const style = document.createElement('style')
  style.textContent = `
    .download-info {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }
    .download-btn-placeholder {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: hsl(var(--card));
      border: 1px solid hsl(var(--border));
      color: hsl(var(--foreground));
      padding: 0.75rem 1.5rem;
      border-radius: 0.75rem;
      font-size: 0.875rem;
      font-weight: 500;
    }
  `
  section.appendChild(style)

  return section
}
