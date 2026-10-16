// js/tours.js
// Tours listing page — loads all tours from the API and handles search

// Base URL for the backend API (running on port 5000)
const API_BASE = 'http://localhost:5000';

// Mobile nav toggle (shared behaviour)
(function initNav() {
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => links.classList.toggle('open'));
  links.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => links.classList.remove('open')));
})();

const grid         = document.getElementById('toursGrid');
const countEl      = document.getElementById('resultsCount');
const searchInput  = document.getElementById('searchInput');
const searchBtn    = document.getElementById('searchBtn');
const clearBtn     = document.getElementById('clearBtn');

const fallbackImg  = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=70';

// Build a single tour card
function buildTourCard(tour) {
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
          <span class="tour-meta">🕐 ${tour.duration} &nbsp;|&nbsp; 🪑 ${tour.availableSeats} seats</span>
          <a href="/tour-details.html?id=${tour._id}" class="btn btn-primary btn-sm">View Details</a>
        </div>
      </div>
    </div>
  `;
}

// Fetch tours from the API (with optional search query)
async function loadTours(search = '') {
  grid.innerHTML = '<div class="spinner"><div class="spinner-ring"></div></div>';
  countEl.textContent = '';

  try {
    const url = search ? `${API_BASE}/api/tours?search=${encodeURIComponent(search)}` : `${API_BASE}/api/tours`;
    const res  = await fetch(url);
    if (!res.ok) throw new Error('API error');
    const tours = await res.json();

    if (tours.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1;">
          <div class="empty-icon">🔍</div>
          <h3>No tours found</h3>
          <p>${search ? `No results for "${search}". Try a different search term.` : 'No tours are available yet.'}</p>
        </div>`;
      countEl.textContent = '';
      return;
    }

    grid.innerHTML = tours.map(buildTourCard).join('');
    countEl.textContent = `Showing ${tours.length} tour${tours.length !== 1 ? 's' : ''}${search ? ` for "${search}"` : ''}`;

  } catch (err) {
    grid.innerHTML = `<div class="alert alert-error" style="grid-column:1/-1;">Could not load tours. Make sure the server is running.</div>`;
  }
}

// Handle search button click
searchBtn.addEventListener('click', () => {
  loadTours(searchInput.value.trim());
});

// Handle Enter key in search box
searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') loadTours(searchInput.value.trim());
});

// Clear search and reload all tours
clearBtn.addEventListener('click', () => {
  searchInput.value = '';
  loadTours();
});

// On page load, check for a ?search= query parameter in the URL
const urlParams = new URLSearchParams(window.location.search);
const initialSearch = urlParams.get('search') || '';
if (initialSearch) searchInput.value = initialSearch;
loadTours(initialSearch);
