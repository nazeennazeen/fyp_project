// middleware/auth.js
// Middleware to protect admin-only routes
// Checks that the current session has a valid admin flag

const requireAdmin = (req, res, next) => {
  // Check if the session has the isAdmin flag set to true
  if (req.session && req.session.isAdmin === true) {
    return next(); // Authenticated — proceed to the route handler
  }
  // Not authenticated — reject the request
  return res.status(401).json({ message: 'Unauthorized. Admin login required.' });
};

module.exports = requireAdmin;
