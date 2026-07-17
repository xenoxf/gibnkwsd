export function init() {
  const hero = document.getElementById('hero')
  if (!hero) return

  const heroContent = hero.querySelector('.hero-content')
  const dashboardWrap = document.getElementById('dashboardImageWrap')

  function update() {
    const rect = hero.getBoundingClientRect()
    const progress = Math.max(0, Math.min(1, -rect.top / rect.height))

    if (heroContent) {
      heroContent.style.transform = `translateY(${-200 * progress}px)`
      heroContent.style.opacity = Math.max(0, 1 - progress)
    }

    if (dashboardWrap) {
      dashboardWrap.style.transform = `translateY(${-250 * progress}px)`
    }
  }

  window.addEventListener('scroll', update, { passive: true })
  update()
}
