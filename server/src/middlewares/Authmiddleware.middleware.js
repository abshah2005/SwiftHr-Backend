import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Middleware to authenticate the token
export const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Access denied' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Middleware to authorize only HR Managers
export const authorizeHRManager = (req, res, next) => {
  if (req.user.role !== 'HRManager') {
    return res.status(403).json({ message: 'Access forbidden: Only HR Managers can perform this action' });
  }
  next();
};

// Middleware to authorize only HR Managers or Admins (if needed)
export const authorizeHRManagerOrAdmin = (req, res, next) => {
  if (req.user.role !== 'HRManager' && req.user.role !== 'Admin') {
    return res.status(403).json({ message: 'Access forbidden: Only HR Managers or Admins can perform this action' });
  }
  next();
};
