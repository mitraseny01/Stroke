const jwt = require('jsonwebtoken');

/**
 * Verifies the JWT sent in the Authorization header ("Bearer <token>").
 * Attaches { id, role } to req.user, where role is 'patient' or 'provider'.
 */
function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

// Restricts a route to a specific role ('patient' or 'provider')
function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ message: `Only ${role} accounts can access this` });
    }
    next();
  };
}

module.exports = { requireAuth, requireRole };
