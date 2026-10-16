// js/tours.js
// Tours listing page — loads all tours and handles search

const API_BASE = 'http://localhost:5000';

// Navbar scroll
window.addEventListener('scroll', () => {
  document.getElementById('navbar')?.classList.toggle('scrolled', window.scrollY > 10);
});

// Mobile nav
(function initNav() {
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => links.classList.toggle('open'));
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
})();

const grid        = document.getElementById('toursGrid');
const countEl     = document.getElementById('resultsCount');
const searchInput = document.getElementById('searchInput');
const searchBtn   = document.getElementById('searchBtn');
const clearBtn    = document.getElementById('clearBtn');

const fallback = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=70';

function buildTourCard(tour) {
  const img = tour.imageUrl || fallback;
  const viewLabel  = window.t ? window.t('view_details') : 'View Details';
  const seatsLabel = window.t ? window.t('seats_label')  : 'seats left';

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
            &nbsp;·&nbsp;
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
            ${tour.availableSeats} ${seatsLabel}
          </span>
          <a href="/tour-details.html?id=${tour._id}" class="btn btn-primary btn-sm">${viewLabel}</a>
        </div>
      </div>
    </div>
  `;
}

async function loadTours(search = '') {
  grid.innerHTML = '<div class="spinner"><div class="spinner-ring"></div></div>';
  countEl.textContent = '';

  try {
    const url = search
      ? `${API_BASE}/api/tours?search=${encodeURIComponent(search)}`
      : `${API_BASE}/api/tours`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('API error');
    const tours = await res.json();

    if (tours.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </div>
          <h3>${window.t ? window.t('no_tours') : 'No tours found'}</h3>
          <p>${search ? (window.t ? `${window.t('no_tours_sub')}` : `No results for "${search}".`) : (window.t ? window.t('no_tours_sub') : 'No tours available yet.')}</p>
        </div>`;
      return;
    }

    grid.innerHTML = tours.map(buildTourCard).join('');

    const showing = window.t ? window.t('showing') : 'Showing';
    const word    = tours.length === 1
      ? (window.t ? window.t('tours_word') : 'tour')
      : (window.t ? window.t('tours_word_pl') : 'tours');
    const forTxt  = search ? ` ${window.t ? window.t('tour_for') : 'for'} "${search}"` : '';
    countEl.textContent = `${showing} ${tours.length} ${word}${forTxt}`;

  } catch {
    grid.innerHTML = `
      <div class="alert alert-error" style="grid-column:1/-1;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <span>${window.t ? window.t('server_error') : 'Could not load tours. Make sure the server is running.'}</span>
      </div>`;
  }
}

searchBtn.addEventListener('click', () => loadTours(searchInput.value.trim()));
searchInput.addEventListener('keydown', e => { if (e.key === 'Enter') loadTours(searchInput.value.trim()); });
clearBtn.addEventListener('click', () => { searchInput.value = ''; loadTours(); });

// Load on page start (check URL param)
const urlParams = new URLSearchParams(window.location.search);
const initialSearch = urlParams.get('search') || '';
if (initialSearch) searchInput.value = initialSearch;
loadTours(initialSearch);
