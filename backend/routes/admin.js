import express from 'express';
import {
  loginAdmin,
  sendInvitation,
  resendAdminInvite,
  acceptAdminInvite,
  getAllAdmins,
  deleteAdmin,
  getAdminLogs,
  changeAdminPassword,
  updateAdminRole,
  updateAdminStatus,
  getAllDonations,
} from '../controllers/adminController.js';

import { authenticateAdmin, onlySuperAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// 🔐 Authentication
router.post('/login', loginAdmin);

// 📩 Invitations
router.post('/invite', authenticateAdmin, onlySuperAdmin, sendInvitation);
router.post('/invite/resend', authenticateAdmin, onlySuperAdmin, resendAdminInvite);
router.post('/accept', acceptAdminInvite);

// 👥 Admin Users
router.get('/all', authenticateAdmin, onlySuperAdmin, getAllAdmins);
router.delete('/:id', authenticateAdmin, onlySuperAdmin, deleteAdmin);
router.put('/users/:id/role', authenticateAdmin, onlySuperAdmin, updateAdminRole);
router.patch('/users/:id/status', authenticateAdmin, onlySuperAdmin, updateAdminStatus);

// ⚙️ Settings
router.post('/change-password', authenticateAdmin, changeAdminPassword);

// 📈 Logs & Donations
router.get('/logs', authenticateAdmin, getAdminLogs);
router.get('/donations', authenticateAdmin, getAllDonations);

export default router;
