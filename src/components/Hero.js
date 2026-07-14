import { SITE, ASSETS, HERO } from '../services/config.js'

export function init() {
  const section = document.createElement('section')
  section.className = 'hero'
  section.id = 'hero'

  section.innerHTML = `
    <div class="hero-content" id="heroContent">
      <div class="hero-tag-wrapper">
        <div class="tag-pill liquid-glass">
          <span class="badge-new">New</span>
          <span class="tag-text">Introducing ${SITE.name} ${HERO.tag}</span>
        </div>
      </div>

      <h1 class="hero-title hero-title-wrapper">
        ${HERO.title[0]}<br />
        ${HERO.title[1]}<span class="serif-italic">${HERO.italicWord}</span>${HERO.titleEnd}
      </h1>

      <p class="hero-subtitle hero-subtitle-wrapper">
        ${HERO.subtitle}
      </p>

      <div class="hero-cta-wrapper">
        <button class="btn-cta" id="ctaButton">${HERO.cta}</button>
      </div>
    </div>

    <div class="hero-dashboard-wrapper" id="dashboardWrapper">
      <div class="dashboard-area">
        <video class="dashboard-bg-video" autoplay muted loop playsinline>
          <source src="${ASSETS.heroVideo}" type="video/mp4" />
        </video>
        <div class="dashboard-image-wrap" id="dashboardImageWrap">
          <img
            class="dashboard-image"
            src="${ASSETS.heroDashboard}"
            alt="${SITE.name} App"
            loading="lazy"
          />
        </div>
        <div class="dashboard-fade"></div>
      </div>
    </div>
  `

  return section
}
