export function init() {
  const heroEls = document.querySelectorAll(
    '.hero-tag-wrapper, .hero-title-wrapper, .hero-subtitle-wrapper, .hero-cta-wrapper, .hero-dashboard-wrapper'
  )
  const fadeEls = document.querySelectorAll('.fade-in')

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.1 }
  )

  heroEls.forEach(el => observer.observe(el))
  fadeEls.forEach(el => observer.observe(el))

  setTimeout(() => {
    heroEls.forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight) {
        el.classList.add('visible')
      }
    })
  }, 100)
}
