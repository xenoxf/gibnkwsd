export function init() {
  const section = document.createElement('section')
  section.className = 'changelog-section'

  section.innerHTML = `
    <h2 class="fade-in">What's new</h2>
    <div id="changelog-content">
      <p style="color:hsl(0,0%,65%);">Loading changelog...</p>
    </div>
  `

  return section
}
