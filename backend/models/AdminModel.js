import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const AdminSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['root', 'admin'], default: 'admin' },
  invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  invitationToken: String,
  invitationExpires: Date,
  lastLogin: Date,
  permissions: {
    viewDonations: Boolean,
    manageUsers: Boolean,
    exportData: Boolean
  }
});

export default mongoose.model('Admin', AdminSchema);