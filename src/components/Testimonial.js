import { ASSETS, TESTIMONIAL } from '../services/config.js'

export function init() {
  const section = document.createElement('section')
  section.className = 'testimonial'
  section.id = 'testimonial'

  section.innerHTML = `
    <div class="testimonial-inner fade-in">
      <img
        class="quote-symbol"
        src="${ASSETS.quoteSymbol}"
        alt="" aria-hidden="true"
      />

      <p class="testimonial-text" id="testimonialText"></p>

      <span class="quote-close" aria-hidden="true">&rdquo;</span>

      <div class="testimonial-author">
        <img
          class="testimonial-avatar"
          src="${ASSETS.testimonialAvatar}"
          alt="${TESTIMONIAL.author.name}"
        />
        <div>
          <div class="author-name">${TESTIMONIAL.author.name}</div>
          <div class="author-role">${TESTIMONIAL.author.role}</div>
        </div>
      </div>
    </div>
  `

  return section
}
