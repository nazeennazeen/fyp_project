// frontend/server.js
// Simple static file server for the frontend on port 3000

const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve all static files from the frontend folder
app.use(express.static(path.join(__dirname)));

// Fallback: serve index.html for any unknown route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🌐 Frontend running at http://localhost:${PORT}`);
});
