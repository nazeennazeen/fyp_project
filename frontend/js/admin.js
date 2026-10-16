// js/admin.js
// Admin dashboard logic: login, tour CRUD, image upload, bookings management

// ---- State ----
let editingTourId = null; // null = creating new, string = editing existing

// ---- Utility: Show / hide admin sections via sidebar ----
function showSection(sectionId) {
  document.querySelectorAll('.admin-section').forEach((s) => s.classList.remove('active'));
  document.querySelectorAll('.admin-nav-link').forEach((l) => l.classList.remove('active'));

  const section = document.getElementById('section-' + sectionId);
  if (section) section.classList.add('active');

  const link = document.querySelector(`[data-section="${sectionId}"]`);
  if (link) link.classList.add('active');

  // Load data for the activated section
  if (sectionId === 'toursList')    loadToursTable();
  if (sectionId === 'bookingsList') loadBookingsTable();
  if (sectionId === 'overview')     loadOverviewStats();
}

// Attach sidebar navigation clicks
document.querySelectorAll('.admin-nav-link').forEach((link) => {
  link.addEventListener('click', () => showSection(link.dataset.section));
});

// "Add Tour" shortcut from tours list header
document.getElementById('goAddTourBtn').addEventListener('click', () => {
  resetTourForm();
  showSection('addTour');
});

// Cancel editing — reset form and go back to list
document.getElementById('cancelEditBtn').addEventListener('click', () => {
  resetTourForm();
  showSection('toursList');
});

// ====================================================
// ---- ADMIN LOGIN / LOGOUT ----
// ====================================================

const loginPage    = document.getElementById('loginPage');
const dashboardPage = document.getElementById('dashboardPage');

// Check if the user already has an active admin session
async function checkSession() {
  try {
    const res = await fetch('/api/admin/check');
    if (res.ok) {
      showDashboard();
    }
    // If not OK (401), stay on login page
  } catch {
    // Server might be down — stay on login page
  }
}

function showDashboard() {
  loginPage.style.display    = 'none';
  dashboardPage.style.display = 'block';
  loadOverviewStats();
}

// Login form submission
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const errEl = document.getElementById('loginError');
  errEl.style.display = 'none';

  const username = document.getElementById('adminUsername').value.trim();
  const password = document.getElementById('adminPassword').value;
  const btn      = document.getElementById('loginBtn');

  btn.textContent = 'Signing in…';
  btn.disabled = true;

  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      errEl.textContent = data.message || 'Invalid credentials.';
      errEl.style.display = 'flex';
      return;
    }

    showDashboard();

  } catch {
    errEl.textContent = 'Could not connect to the server.';
    errEl.style.display = 'flex';
  } finally {
    btn.textContent = 'Sign In';
    btn.disabled = false;
  }
});

// Logout button
document.getElementById('logoutBtn').addEventListener('click', async () => {
  await fetch('/api/admin/logout', { method: 'POST' });
  loginPage.style.display    = 'block';
  dashboardPage.style.display = 'none';
  document.getElementById('loginForm').reset();
});

// ====================================================
// ---- OVERVIEW STATS ----
// ====================================================
async function loadOverviewStats() {
  try {
    const [toursRes, bookingsRes] = await Promise.all([
      fetch('/api/tours'),
      fetch('/api/admin/bookings'),
    ]);

    if (toursRes.ok) {
      const tours = await toursRes.json();
      document.getElementById('statTotalTours').textContent = tours.length;
    }

    if (bookingsRes.ok) {
      const bookings = await bookingsRes.json();
      document.getElementById('statTotalBookings').textContent = bookings.length;

      const pending = bookings.filter((b) => b.status === 'pending').length;
      document.getElementById('statPending').textContent = pending;

      const revenue = bookings
        .filter((b) => b.status !== 'cancelled')
        .reduce((sum, b) => sum + b.totalPrice, 0);
      document.getElementById('statRevenue').textContent = '$' + revenue.toLocaleString();
    }
  } catch { /* silently fail */ }
}

// ====================================================
// ---- TOURS TABLE ----
// ====================================================
async function loadToursTable() {
  const wrap = document.getElementById('toursTableWrap');
  wrap.innerHTML = '<div class="spinner"><div class="spinner-ring"></div></div>';

  try {
    const res  = await fetch('/api/tours');
    const tours = await res.json();

    if (tours.length === 0) {
      wrap.innerHTML = '<div class="alert alert-info">No tours yet. <a href="#" onclick="showSection(\'addTour\')">Add the first one →</a></div>';
      return;
    }

    const fallback = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=100&q=60';

    const rows = tours.map((t) => `
      <tr>
        <td><img src="${t.imageUrl || fallback}" alt="${t.title}" onerror="this.src='${fallback}'" /></td>
        <td><strong>${t.title}</strong></td>
        <td>${t.location}</td>
        <td>$${t.price.toLocaleString()}</td>
        <td>${t.duration}</td>
        <td>${t.availableSeats}</td>
        <td>
          <div class="table-actions">
            <button class="btn btn-outline btn-sm" onclick="editTour('${t._id}')">Edit</button>
            <button class="btn btn-danger btn-sm" onclick="deleteTour('${t._id}', '${t.title.replace(/'/g, "\\'")}')">Delete</button>
          </div>
        </td>
      </tr>`).join('');

    wrap.innerHTML = `
      <div class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Image</th><th>Name</th><th>Location</th><th>Price</th><th>Duration</th><th>Seats</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;

  } catch {
    wrap.innerHTML = '<div class="alert alert-error">Could not load tours.</div>';
  }
}

// ---- Edit Tour: prefill the form ----
async function editTour(id) {
  showSection('addTour');

  try {
    const res  = await fetch(`/api/tours/${id}`);
    const tour = await res.json();

    editingTourId = id;
    document.getElementById('tourFormTitle').textContent = '✏️ Edit Tour';
    document.getElementById('saveTourBtn').textContent   = 'Update Tour';
    document.getElementById('cancelEditBtn').style.display = 'inline-flex';
    document.getElementById('editTourId').value = id;

    document.getElementById('fTitle').value       = tour.title;
    document.getElementById('fLocation').value    = tour.location;
    document.getElementById('fDescription').value = tour.description;
    document.getElementById('fPrice').value       = tour.price;
    document.getElementById('fDuration').value    = tour.duration;
    document.getElementById('fSeats').value       = tour.availableSeats;
    document.getElementById('fImageUrl').value    = tour.imageUrl || '';
    document.getElementById('fImageKey').value    = tour.imageKey || '';

  } catch {
    alert('Could not load tour data for editing.');
  }
}

// ---- Delete Tour ----
async function deleteTour(id, name) {
  if (!confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) return;

  try {
    const res = await fetch(`/api/tours/${id}`, { method: 'DELETE' });
    const data = await res.json();

    if (res.ok) {
      loadToursTable(); // Refresh the table
    } else {
      alert(data.message || 'Could not delete tour.');
    }
  } catch {
    alert('Server error while deleting tour.');
  }
}

// ---- Tour Form: Save (Create or Update) ----
document.getElementById('tourForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const msgEl = document.getElementById('tourFormMsg');
  msgEl.style.display = 'none';

  const body = {
    title:          document.getElementById('fTitle').value.trim(),
    location:       document.getElementById('fLocation').value.trim(),
    description:    document.getElementById('fDescription').value.trim(),
    price:          parseFloat(document.getElementById('fPrice').value),
    duration:       document.getElementById('fDuration').value.trim(),
    availableSeats: parseInt(document.getElementById('fSeats').value, 10),
    imageUrl:       document.getElementById('fImageUrl').value.trim(),
    imageKey:       document.getElementById('fImageKey').value.trim(),
  };

  const btn = document.getElementById('saveTourBtn');
  btn.disabled = true;
  btn.textContent = 'Saving…';

  try {
    const isEditing = !!editingTourId;
    const url    = isEditing ? `/api/tours/${editingTourId}` : '/api/tours';
    const method = isEditing ? 'PUT' : 'POST';

    const res  = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      msgEl.className = 'alert alert-error';
      msgEl.textContent = data.message || 'Failed to save tour.';
      msgEl.style.display = 'flex';
      return;
    }

    msgEl.className = 'alert alert-success';
    msgEl.textContent = isEditing ? '✅ Tour updated successfully!' : '✅ Tour created successfully!';
    msgEl.style.display = 'flex';

    if (!isEditing) resetTourForm(); // Clear form after creating

  } catch {
    msgEl.className = 'alert alert-error';
    msgEl.textContent = 'Server error. Please try again.';
    msgEl.style.display = 'flex';
  } finally {
    btn.disabled = false;
    btn.textContent = editingTourId ? 'Update Tour' : 'Save Tour';
  }
});

function resetTourForm() {
  editingTourId = null;
  document.getElementById('tourForm').reset();
  document.getElementById('editTourId').value = '';
  document.getElementById('tourFormTitle').textContent = '➕ Add New Tour';
  document.getElementById('saveTourBtn').textContent   = 'Save Tour';
  document.getElementById('cancelEditBtn').style.display = 'none';
  document.getElementById('tourFormMsg').style.display   = 'none';
  document.getElementById('uploadStatus').textContent     = '';
  document.getElementById('fImageKey').value = '';
}

// ====================================================
// ---- IMAGE UPLOAD TO BACKBLAZE B2 ----
// ====================================================
document.getElementById('uploadImageBtn').addEventListener('click', async () => {
  const fileInput  = document.getElementById('imageFileInput');
  const statusEl   = document.getElementById('uploadStatus');
  const imageUrlEl = document.getElementById('fImageUrl');
  const imageKeyEl = document.getElementById('fImageKey');

  const file = fileInput.files[0];
  if (!file) {
    statusEl.textContent = '⚠️ Please select an image file first.';
    return;
  }

  const formData = new FormData();
  formData.append('image', file);

  statusEl.textContent = '⏳ Uploading…';

  try {
    const res  = await fetch('/api/upload', { method: 'POST', body: formData });
    const data = await res.json();

    if (!res.ok) {
      statusEl.textContent = '❌ ' + (data.message || 'Upload failed.');
      return;
    }

    // Auto-fill the Image URL and Key fields
    imageUrlEl.value = data.imageUrl;
    imageKeyEl.value = data.imageKey;
    statusEl.textContent = '✅ Uploaded successfully!';

  } catch {
    statusEl.textContent = '❌ Upload failed. Check server connection.';
  }
});

// ====================================================
// ---- BOOKINGS TABLE ----
// ====================================================
async function loadBookingsTable() {
  const wrap = document.getElementById('bookingsTableWrap');
  wrap.innerHTML = '<div class="spinner"><div class="spinner-ring"></div></div>';

  try {
    const res = await fetch('/api/admin/bookings');
    if (!res.ok) throw new Error('Unauthorized');

    const bookings = await res.json();

    if (bookings.length === 0) {
      wrap.innerHTML = '<div class="alert alert-info">No bookings yet.</div>';
      return;
    }

    const rows = bookings.map((b) => {
      const tourName = b.tourId ? b.tourId.title : 'Deleted Tour';
      const date     = new Date(b.bookingDate).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' });

      return `
        <tr>
          <td><code style="font-size:0.82rem;">${b.bookingReference}</code></td>
          <td><strong>${b.fullName}</strong><br/><span style="font-size:0.82rem;color:var(--text-muted);">${b.email}</span></td>
          <td>${tourName}</td>
          <td>${date}</td>
          <td>${b.numberOfPeople}</td>
          <td>$${b.totalPrice.toLocaleString()}</td>
          <td>
            <select class="status-select" data-booking-id="${b._id}" style="padding:4px 8px;border:1px solid var(--border);border-radius:6px;font-family:var(--font-body);font-size:0.85rem;cursor:pointer;">
              <option value="pending"   ${b.status==='pending'   ? 'selected':''}>Pending</option>
              <option value="confirmed" ${b.status==='confirmed' ? 'selected':''}>Confirmed</option>
              <option value="cancelled" ${b.status==='cancelled' ? 'selected':''}>Cancelled</option>
            </select>
          </td>
        </tr>`;
    }).join('');

    wrap.innerHTML = `
      <div class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Reference</th><th>Customer</th><th>Tour</th><th>Date</th><th>People</th><th>Total</th><th>Status</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;

    // Attach change listeners to status dropdowns
    wrap.querySelectorAll('.status-select').forEach((sel) => {
      sel.addEventListener('change', async () => {
        const bookingId = sel.dataset.bookingId;
        const newStatus = sel.value;

        try {
          const res = await fetch(`/api/admin/bookings/${bookingId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus }),
          });
          if (!res.ok) throw new Error();
        } catch {
          alert('Could not update booking status. Please try again.');
          loadBookingsTable(); // Reset the table on failure
        }
      });
    });

  } catch {
    wrap.innerHTML = '<div class="alert alert-error">Could not load bookings. Make sure you are logged in.</div>';
  }
}

// ====================================================
// ---- INIT: Check session on page load ----
// ====================================================
checkSession();
