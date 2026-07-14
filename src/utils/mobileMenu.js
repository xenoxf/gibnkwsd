import { SITE, NAV } from '../services/config.js'

export function init() {
  const btn = document.querySelector('.mobile-menu-btn')
  if (!btn) return

  const menu = document.createElement('div')
  menu.className = 'mobile-overlay'
  Object.assign(menu.style, {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0, 0, 0, 0.95)', backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)', zIndex: 100,
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', gap: '2.5rem',
    opacity: 0, pointerEvents: 'none', transition: 'opacity 0.4s ease'
  })

  NAV.forEach(item => {
    const a = document.createElement('a')
    a.href = item.href
    a.textContent = item.label
    Object.assign(a.style, {
      fontSize: '1.75rem', fontWeight: 500, color: 'hsl(0, 0%, 65%)',
      textDecoration: 'none', transition: 'color 0.2s'
    })
    a.addEventListener('mouseenter', () => a.style.color = 'hsl(0, 0%, 100%)')
    a.addEventListener('mouseleave', () => a.style.color = 'hsl(0, 0%, 65%)')
    a.addEventListener('click', close)
    menu.appendChild(a)
  })

  const downloadLink = document.createElement('a')
  downloadLink.href = '#downloadSection'
  downloadLink.textContent = 'Download'
  Object.assign(downloadLink.style, {
    marginTop: '1rem', padding: '0.875rem 2.5rem',
    background: 'hsl(0, 0%, 100%)', color: 'hsl(0, 0%, 0%)',
    borderRadius: '9999px', fontSize: '1.125rem', fontWeight: 600,
    textDecoration: 'none', transition: 'opacity 0.2s'
  })
  downloadLink.addEventListener('mouseenter', () => downloadLink.style.opacity = '0.85')
  downloadLink.addEventListener('mouseleave', () => downloadLink.style.opacity = '1')
  downloadLink.addEventListener('click', close)
  menu.appendChild(downloadLink)

  const closeBtn = document.createElement('button')
  closeBtn.innerHTML = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
  Object.assign(closeBtn.style, {
    position: 'absolute', top: '1.5rem', right: '1.5rem',
    background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem'
  })
  closeBtn.addEventListener('click', close)
  menu.appendChild(closeBtn)
  document.body.appendChild(menu)

  function open() {
    menu.style.opacity = 1
    menu.style.pointerEvents = 'auto'
    document.body.style.overflow = 'hidden'
  }

  function close() {
    menu.style.opacity = 0
    menu.style.pointerEvents = 'none'
    document.body.style.overflow = ''
  }

  btn.addEventListener('click', open)
}
