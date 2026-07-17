import { TESTIMONIAL } from '../services/config.js'

export function init() {
  const container = document.getElementById('testimonialText')
  if (!container) return

  const words = TESTIMONIAL.text.split(/\s+/)
  container.innerHTML = words
    .map((w, i) => `<span class="testimonial-word" data-index="${i}">${w}</span>`)
    .join('')

  const wordEls = container.querySelectorAll('.testimonial-word')
  const total = wordEls.length

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return

        const containerRect = container.getBoundingClientRect()
        const progress = 1 - (entry.target.getBoundingClientRect().bottom - containerRect.top) / containerRect.offsetHeight
        const clamped = Math.max(0, Math.min(1, progress))

        wordEls.forEach((el, i) => {
          if (clamped >= i / total) el.classList.add('revealed')
        })

        if (clamped >= 1) observer.unobserve(entry.target)
      })
    },
    { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] }
  )

  observer.observe(container)
}
