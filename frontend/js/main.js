// js/main.js
// Shared utilities and homepage logic

const API_BASE = 'http://localhost:5000';

// ---- Navbar scroll shadow ----
window.addEventListener('scroll', () => {
  document.getElementById('navbar')?.classList.toggle('scrolled', window.scrollY > 10);
});

// ---- Mobile nav toggle ----
(function initNav() {
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => links.classList.toggle('open'));
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
})();

// ---- Build a tour card ----
function buildTourCard(tour) {
  const fallback = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=70';
  const img = tour.imageUrl || fallback;
  const viewLabel = window.t ? window.t('view_details') : 'View Details';
  const seatsLabel = window.t ? window.t('seats_label') : 'seats left';
  const durationLabel = window.t ? window.t('duration_label') : 'Duration';

  return `
    <div class="tour-card">
      <div class="tour-card-image">
        <img src="${img}" alt="${tour.title}" loading="lazy" onerror="this.src='${fallback}'" />
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
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            ${tour.duration}
          </span>
          <a href="/tour-details.html?id=${tour._id}" class="btn btn-primary btn-sm">${viewLabel}</a>
        </div>
      </div>
    </div>
  `;
}

// ---- Homepage: Load featured tours ----
(async function loadFeaturedTours() {
  const container = document.getElementById('featuredTours');
  if (!container) return;

  try {
    const res = await fetch(`${API_BASE}/api/tours`);
    if (!res.ok) throw new Error('Failed');
    const tours = await res.json();

    const statEl = document.getElementById('statTours');
    if (statEl) statEl.textContent = tours.length + '+';

    if (tours.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          </div>
          <h3>${window.t ? window.t('no_tours') : 'No tours yet'}</h3>
          <p>${window.t ? window.t('no_tours_sub') : 'Visit the admin dashboard to add your first tour.'}</p>
        </div>`;
      return;
    }

    container.innerHTML = tours.slice(0, 6).map(buildTourCard).join('');
  } catch {
    container.innerHTML = `
      <div class="alert alert-error" style="grid-column:1/-1;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <span>${window.t ? window.t('server_error') : 'Could not load tours. Is the server running?'}</span>
      </div>`;
  }
})();

// ---- Homepage: Hero search ----
(function initHeroSearch() {
  const btn   = document.getElementById('heroSearchBtn');
  const input = document.getElementById('heroSearchInput');
  if (!btn || !input) return;

  const doSearch = () => {
    const q = input.value.trim();
    window.location.href = `/tours.html${q ? '?search=' + encodeURIComponent(q) : ''}`;
  };
  btn.addEventListener('click', doSearch);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });
})();
