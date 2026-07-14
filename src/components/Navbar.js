import { SITE, ASSETS, NAV } from '../services/config.js'

export function init() {
  const nav = document.createElement('nav')
  nav.className = 'navbar'
  nav.id = 'navbar'

  const linksHTML = NAV.map(item =>
    `<a href="${item.href}"${item.active ? ' class="active"' : ''}>${item.label}</a>`
  ).join('')

  nav.innerHTML = `
    <div class="navbar-left">
      <a href="/" class="navbar-logo">
        <img src="${ASSETS.logo}" alt="${SITE.name}" width="28" height="28" />
        <span>${SITE.name}</span>
      </a>
      <div class="navbar-links">
        ${linksHTML}
      </div>
    </div>
    <div class="navbar-right">
      <a href="#downloadSection" class="btn-download-nav">Download</a>
      <button class="mobile-menu-btn" aria-label="Toggle menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  `

  document.body.prepend(nav)

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50)
  }, { passive: true })

  return nav
}
