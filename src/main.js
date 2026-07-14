import { init as initNavbar } from './components/Navbar.js'
import { init as initHero } from './components/Hero.js'
import { init as initTestimonial } from './components/Testimonial.js'
import { init as initDownload } from './components/Download.js'
import { init as initChangelog } from './components/Changelog.js'

import { init as initEntrance } from './animations/entrance.js'
import { init as initParallax } from './animations/parallax.js'
import { init as initWordReveal } from './animations/wordReveal.js'

import { init as initMobileMenu } from './utils/mobileMenu.js'
import { init as initDownloadSetup } from './utils/downloadSetup.js'

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app')

  app.append(initNavbar())
  app.append(initHero())
  app.append(initTestimonial())
  app.append(initDownload())
  app.append(initChangelog())

  initEntrance()
  initParallax()
  initMobileMenu()

  document.getElementById('ctaButton')?.addEventListener('click', () => {
    document.getElementById('downloadSection')?.scrollIntoView({ behavior: 'smooth' })
  })

  initDownloadSetup()
  initWordReveal()
})
