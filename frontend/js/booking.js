// js/booking.js
// Tour Details page — loads tour data and handles the booking form

// Base URL for the backend API (running on port 5000)
const API_BASE = 'http://localhost:5000';

// Navbar scroll shadow
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

// Mobile nav toggle
(function initNav() {
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => links.classList.toggle('open'));
  links.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => links.classList.remove('open')));
})();

// Get the tour ID from the URL: /tour-details.html?id=<ID>
const params = new URLSearchParams(window.location.search);
const tourId = params.get('id');

const loadingState  = document.getElementById('loadingState');
const errorState    = document.getElementById('errorState');
const tourContent   = document.getElementById('tourContent');

let tourPrice = 0; // Stored globally so the price calculator can reference it

// ---- Load Tour Details ----
async function loadTourDetails() {
  if (!tourId) {
    loadingState.style.display = 'none';
    errorState.style.display   = 'block';
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/tours/${tourId}`);
    if (!res.ok) throw new Error('Tour not found');
    const tour = await res.json();

    // Populate page header
    document.title = `${tour.title} — WanderVista`;
    document.getElementById('breadcrumbTitle').textContent = tour.title;
    document.getElementById('headerTitle').textContent     = tour.title;
    document.getElementById('headerLocation').textContent  = '📍 ' + tour.location;

    // Populate tour detail fields
    const fallback = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80';
    document.getElementById('tourImage').src        = tour.imageUrl || fallback;
    document.getElementById('tourImage').alt        = tour.title;
    document.getElementById('infoLocation').textContent = tour.location;
    document.getElementById('infoPrice').textContent    = '$' + tour.price.toLocaleString();
    document.getElementById('infoDuration').textContent = tour.duration;
    document.getElementById('infoSeats').textContent    = tour.availableSeats + ' left';
    document.getElementById('tourDescription').textContent = tour.description;

    // Set tour ID into the hidden form field
    document.getElementById('tourIdInput').value = tour._id;

    // Store price for the live calculator
    tourPrice = tour.price;
    updateTotalPrice();

    // Set the minimum booking date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('bookingDate').min = tomorrow.toISOString().split('T')[0];

    // Show the tour content
    loadingState.style.display  = 'none';
    tourContent.style.display   = 'block';

  } catch (err) {
    loadingState.style.display = 'none';
    errorState.style.display   = 'block';
  }
}

// ---- Live Price Calculator ----
function updateTotalPrice() {
  const people = parseInt(document.getElementById('numberOfPeople').value, 10) || 0;
  const total  = people > 0 ? tourPrice * people : 0;
  document.getElementById('pricePerPerson').textContent = '$' + tourPrice.toLocaleString();
  document.getElementById('totalPrice').textContent     = people > 0 ? '$' + total.toLocaleString() : '—';
}

document.getElementById('numberOfPeople').addEventListener('input', updateTotalPrice);

// ---- Booking Form Submission ----
document.getElementById('bookingForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const errorBox  = document.getElementById('bookingError');
  const errorText = document.getElementById('bookingErrorText');
  errorBox.style.display = 'none';

  const body = {
    tourId:         document.getElementById('tourIdInput').value,
    fullName:       document.getElementById('fullName').value.trim(),
    email:          document.getElementById('email').value.trim(),
    phone:          document.getElementById('phone').value.trim(),
    numberOfPeople: parseInt(document.getElementById('numberOfPeople').value, 10),
    bookingDate:    document.getElementById('bookingDate').value,
  };

  // Basic client-side validation
  if (!body.fullName || !body.email || !body.phone || !body.bookingDate) {
    errorText.textContent = window.t ? window.t('err_fill') : 'Please fill in all required fields.';
    errorBox.style.display = 'flex';
    return;
  }

  if (body.numberOfPeople < 1 || isNaN(body.numberOfPeople)) {
    errorText.textContent = window.t ? window.t('err_people') : 'Please enter at least 1 person.';
    errorBox.style.display = 'flex';
    return;
  }

  const bookBtn = document.getElementById('bookBtn');
  bookBtn.textContent = 'Processing…';
  bookBtn.disabled = true;

  try {
    const res = await fetch(`${API_BASE}/api/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      errorText.textContent = data.message || 'Booking failed. Please try again.';
      errorBox.style.display = 'flex';
      return;
    }

    // Show confirmation message
    document.getElementById('bookingFormWrap').style.display = 'none';
    document.getElementById('bookingSuccess').style.display  = 'block';
    document.getElementById('bookingRefDisplay').textContent  = data.bookingReference;
    document.getElementById('totalPriceDisplay').textContent  = '$' + data.totalPrice.toLocaleString();

    // Scroll the booking card into view
    document.querySelector('.booking-card').scrollIntoView({ behavior: 'smooth', block: 'center' });

  } catch {
    errorText.textContent = window.t ? window.t('err_server') : 'Could not connect to the server. Please try again.';
    errorBox.style.display = 'flex';
  } finally {
    bookBtn.querySelector('span').textContent = window.t ? window.t('btn_book') : 'Book Now';
    bookBtn.disabled = false;
  }
});

// Start loading the tour
loadTourDetails();
