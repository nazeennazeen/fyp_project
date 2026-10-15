# 🌍 WanderVista — Tourism Booking Website

A fully functional tourism booking website built with **Node.js, Express.js, MongoDB, and Vanilla JavaScript** as a university final-year project.

---

## 📁 Project Structure

```
tourism-booking/
├── public/                  # Frontend (HTML, CSS, JS)
│   ├── index.html           # Homepage
│   ├── tours.html           # Tours listing page
│   ├── tour-details.html    # Tour detail + booking form
│   ├── my-bookings.html     # Booking lookup page
│   ├── admin.html           # Admin dashboard
│   ├── css/
│   │   └── style.css        # All styles
│   └── js/
│       ├── main.js          # Shared utilities + homepage
│       ├── tours.js         # Tours listing page logic
│       ├── booking.js       # Tour detail + booking logic
│       └── admin.js         # Admin dashboard logic
├── models/
│   ├── Tour.js              # Mongoose Tour schema
│   └── Booking.js           # Mongoose Booking schema
├── routes/
│   ├── tourRoutes.js        # Tour CRUD API routes
│   ├── bookingRoutes.js     # Booking creation + lookup
│   ├── adminRoutes.js       # Admin auth + booking management
│   └── uploadRoutes.js      # Image upload to Backblaze B2
├── config/
│   ├── database.js          # MongoDB connection
│   └── backblaze.js         # Backblaze B2 S3 client
├── middleware/
│   └── auth.js              # Admin session guard
├── server.js                # Express app entry point
├── seed.js                  # Seed 5 sample tours into MongoDB
├── package.json
├── .env                     # Your private credentials (DO NOT COMMIT)
├── .env.example             # Template for credentials
├── .gitignore
└── README.md
```

---

## ⚙️ Prerequisites

Make sure these are installed before you start:

1. **Node.js** (v18 or higher) — https://nodejs.org/
2. **MongoDB Community Server** — https://www.mongodb.com/try/download/community
   - Must be running on `mongodb://127.0.0.1:27017`
   - On Windows: Start it from **Services** or run `mongod` in a terminal

---

## 🚀 Installation & Setup

### Step 1 — Install dependencies

```bash
cd "tourism-booking"
npm install
```

### Step 2 — Configure environment variables

Open the `.env` file and fill in the values:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/tourism_booking
```

#### Generate the admin password hash

Run this command and paste the output into `.env`:

```bash
node -e "const b=require('bcryptjs'); b.hash('YourChosenPassword',10).then(h=>console.log(h))"
```

Set the result as `ADMIN_PASSWORD_HASH=` in your `.env`.

#### Generate a session secret

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Set the result as `SESSION_SECRET=` in your `.env`.

### Step 3 — Seed the database with sample tours

```bash
node seed.js
```

You should see 5 tours inserted into MongoDB.

### Step 4 — Start the server

```bash
npm start
```

Or for auto-restart during development:

```bash
npm run dev
```

### Step 5 — Open the website

Visit: **http://localhost:3000**

---

## 🖼️ Backblaze B2 Image Storage

### How to set it up

1. Create a free account at https://www.backblaze.com/
2. Create a **Bucket** (set it to **Public** for direct image URLs)
3. Go to **App Keys** → **Add a New Application Key**
   - Allow access to your bucket
   - Select **Read and Write** permissions
4. Copy the values into your `.env`:

```env
B2_ENDPOINT=https://s3.us-west-004.backblazeb2.com
B2_REGION=us-west-004
B2_BUCKET_NAME=your-bucket-name
B2_KEY_ID=your-key-id
B2_APPLICATION_KEY=your-application-key
```

> **Note:** The region and endpoint depend on where your bucket is located. Check your Backblaze account for the exact values.

If B2 credentials are not configured, the image upload button in the admin dashboard will return a friendly error. Tours can still be created using a direct image URL.

---

## 🔐 Admin Dashboard

Visit: **http://localhost:3000/admin.html**

- Log in with the username and password you set in `.env`
- Add, edit, and delete tours
- Upload tour images to Backblaze B2
- View all customer bookings
- Update booking status (Pending / Confirmed / Cancelled)

---

## 🗄️ Verifying MongoDB Data

After running `node seed.js` and making some bookings, verify data with:

### Using MongoDB Compass (GUI)
1. Download from https://www.mongodb.com/products/compass
2. Connect to `mongodb://127.0.0.1:27017`
3. Open the `tourism_booking` database
4. Check the `tours` and `bookings` collections

### Using mongosh (command line)
```bash
mongosh
use tourism_booking
db.tours.find().pretty()
db.bookings.find().pretty()
```

---

## 🌐 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/tours` | Public | Get all tours (supports `?search=`) |
| GET | `/api/tours/:id` | Public | Get a single tour |
| POST | `/api/tours` | Admin | Create a new tour |
| PUT | `/api/tours/:id` | Admin | Update a tour |
| DELETE | `/api/tours/:id` | Admin | Delete a tour |
| POST | `/api/bookings` | Public | Create a booking |
| POST | `/api/bookings/lookup` | Public | Find booking by email + reference |
| GET | `/api/admin/bookings` | Admin | Get all bookings |
| PATCH | `/api/admin/bookings/:id` | Admin | Update booking status |
| POST | `/api/upload` | Admin | Upload image to Backblaze B2 |
| POST | `/api/admin/login` | — | Admin login |
| POST | `/api/admin/logout` | — | Admin logout |
| GET | `/api/admin/check` | — | Check session status |

---

## ✅ Feature Summary

| Feature | Status |
|---------|--------|
| Homepage with featured tours | ✅ Working |
| Tours listing page with search | ✅ Working |
| Tour detail page | ✅ Working |
| Booking form with validation | ✅ Working |
| Booking confirmation with reference | ✅ Working |
| My Bookings lookup page | ✅ Working |
| MongoDB local data storage | ✅ Working |
| Atomic seat management (no double-booking) | ✅ Working |
| Admin login with bcrypt password | ✅ Working |
| Admin tour management (CRUD) | ✅ Working |
| Admin bookings table + status update | ✅ Working |
| Backblaze B2 image upload | ⚠️ Requires valid B2 credentials in `.env` |
| Responsive design (mobile + desktop) | ✅ Working |

---

## 📝 Notes for Students

- All booking seat decrements use a **MongoDB transaction** to prevent race conditions when multiple people book simultaneously.
- Admin passwords are stored as **bcrypt hashes** — never in plain text.
- The admin session cookie is **HttpOnly** — JavaScript cannot read it.
- Backblaze credentials are only on the server side, never exposed to the frontend.
- The `.env` file is in `.gitignore` so your credentials won't be accidentally committed.
