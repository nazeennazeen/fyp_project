# FYP Project — Tourism Booking

A tourism booking web application structured as a monorepo.

---

## 📁 Project Structure

```
fyp_project/
├── backend/          ← Express.js API server
│   ├── config/       ← Database & storage config
│   ├── middleware/   ← Auth middleware
│   ├── models/       ← Mongoose models (Tour, Booking)
│   ├── routes/       ← API routes
│   ├── server.js     ← Main server entry point
│   ├── seed.js       ← Database seeder
│   ├── .env.example  ← Environment variable template
│   └── package.json
│
├── frontend/         ← Static HTML/CSS/JS user website
│   ├── css/
│   ├── js/
│   ├── index.html
│   ├── tours.html
│   ├── tour-details.html
│   └── my-bookings.html
│
├── .gitignore
├── package.json      ← Root convenience scripts
└── README.md
```

> **Future folders (coming soon):**
> - `admin/` — Admin panel
> - `super-admin/` — Super admin panel

---

## 🚀 Getting Started

### 1. Setup Backend

```bash
cd backend
npm install
cp .env.example .env
# Fill in your .env values
npm run dev
```

The backend runs at: **http://localhost:5000**

The frontend is served automatically by the backend at the same URL.

---

## 🔑 Environment Variables

See [`backend/.env.example`](./backend/.env.example) for all required variables.

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `MONGODB_URI` | MongoDB connection string |
| `SESSION_SECRET` | Secret for session encryption |
| `B2_*` | Backblaze B2 storage credentials |
| `ADMIN_USERNAME` | Admin login username |
| `ADMIN_PASSWORD_HASH` | Bcrypt hash of admin password |
