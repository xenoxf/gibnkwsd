import { getPlatformEmoji } from './platform.js';

export function toggleMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const menuClose = document.getElementById('mobile-menu-close');
  const mobileMenu = document.getElementById('mobile-menu');

  function toggle() {
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  }

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', toggle);
    if (menuClose) menuClose.addEventListener('click', toggle);
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', toggle);
    });
  }
}

export function setupScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (elements.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}

export function showOSBadge(platform, label) {
  const el = document.getElementById('os-detection');
  if (!el) return;
  const emoji = platform.os ? getPlatformEmoji(platform) : '';
  const archLabel = platform.arch === 'arm64' ? 'ARM' : 'x86_64';
  el.innerHTML = `<span class="os-detection-badge">${emoji} Detected: ${label} (${archLabel})</span>`;
}

export function showVersionBadge(release) {
  const el = document.getElementById('version-info');
  if (!el) return;
  if (release) {
    const tag = release.tag_name.replace(/^v/, '');
    el.innerHTML = `<span class="version-badge-text">v${tag}</span>`;
  }
}
