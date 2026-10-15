// js/main.js
// Shared utilities and homepage-specific logic

// ---- Shared: Mobile nav toggle ----
(function initNav() {
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
  });

  // Close menu when a link is clicked
  links.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => links.classList.remove('open'));
  });
})();

// ---- Helper: Build a tour card HTML string ----
function buildTourCard(tour) {
  const fallbackImg = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=70';
  const imgSrc = tour.imageUrl || fallbackImg;

  return `
    <div class="tour-card">
      <div class="tour-card-image">
        <img src="${imgSrc}" alt="${tour.title}" loading="lazy" onerror="this.src='${fallbackImg}'" />
        <span class="tour-card-price">$${tour.price.toLocaleString()}</span>
      </div>
      <div class="tour-card-body">
        <div class="tour-card-location">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          ${tour.location}
        </div>
        <h3>${tour.title}</h3>
        <p>${tour.description}</p>
        <div class="tour-card-footer">
          <span class="tour-meta">
            🕐 ${tour.duration}
          </span>
          <a href="/tour-details.html?id=${tour._id}" class="btn btn-primary btn-sm">View Details</a>
        </div>
      </div>
    </div>
  `;
}

// ---- Homepage: Load featured tours ----
(async function loadFeaturedTours() {
  const container = document.getElementById('featuredTours');
  if (!container) return; // Only runs on the homepage

  try {
    const res = await fetch('/api/tours');
    if (!res.ok) throw new Error('Failed to load tours');
    const tours = await res.json();

    // Update hero stat counter
    const statEl = document.getElementById('statTours');
    if (statEl) statEl.textContent = tours.length + '+';

    if (tours.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1;">
          <div class="empty-icon">🗺️</div>
          <h3>No tours yet</h3>
          <p>Visit the admin dashboard to add your first tour.</p>
        </div>`;
      return;
    }

    // Show up to 6 featured tours on the homepage
    container.innerHTML = tours.slice(0, 6).map(buildTourCard).join('');
  } catch (err) {
    container.innerHTML = `<div class="alert alert-error" style="grid-column:1/-1;">Could not load tours. Is the server running?</div>`;
  }
})();

// ---- Homepage: Hero search redirects to tours page ----
(function initHeroSearch() {
  const btn   = document.getElementById('heroSearchBtn');
  const input = document.getElementById('heroSearchInput');
  if (!btn || !input) return;

  const doSearch = () => {
    const query = input.value.trim();
    window.location.href = `/tours.html${query ? '?search=' + encodeURIComponent(query) : ''}`;
  };

  btn.addEventListener('click', doSearch);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') doSearch(); });
})();
