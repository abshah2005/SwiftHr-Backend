import express from 'express';
import { createUser, updateUser, deleteUser, getUsers, getUserById } from '../controllers/userController.js';
import { authenticateToken, authorizeRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Protect user creation route to allow only Admins
router.post('/', authenticateToken, authorizeRole(['Admin']), createUser);
router.put('/:id', authenticateToken, authorizeRole(['Admin']), updateUser);
router.delete('/:id', authenticateToken, authorizeRole(['Admin']), deleteUser);
router.get('/', authenticateToken, authorizeRole(['Admin', 'HRManager']), getUsers);
router.get('/:id', authenticateToken, authorizeRole(['Admin', 'HRManager']), getUserById);

export default router;
