// frontend-server.js
// Dedicated Frontend Static Server running on port 3000
// Serves static HTML/CSS/JS and transparently proxies /api requests to backend on port 5000

const express = require('express');
const path = require('path');
const http = require('http');

const app = express();
const PORT = 3000;
const BACKEND_PORT = process.env.BACKEND_PORT || 5000;

// Reverse-proxy /api requests to backend running on port 5000
app.use('/api', (req, res) => {
  const options = {
    hostname: '127.0.0.1',
    port: BACKEND_PORT,
    path: `/api${req.url}`,
    method: req.method,
    headers: {
      ...req.headers,
      host: `127.0.0.1:${BACKEND_PORT}`,
    },
  };

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  proxyReq.on('error', (err) => {
    console.error('Frontend proxy error:', err.message);
    res.status(502).json({ message: `Backend server is not reachable on port ${BACKEND_PORT}` });
  });

  req.pipe(proxyReq, { end: true });
});

// Serve frontend static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// Fallback to index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🌐 Frontend server running at http://localhost:${PORT}`);
  console.log(`🔗 API proxy forwarding /api -> http://localhost:${BACKEND_PORT}/api`);
});
