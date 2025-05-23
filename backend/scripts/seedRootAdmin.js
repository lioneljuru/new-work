// backend/scripts/seedRootAdmin.js
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import Admin from '../models/AdminModel.js';

dotenv.config();

async function seedRootAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existing = await Admin.findOne({ email: "root@admin.com" });
    if (existing) {
      console.log("⚠️  Root admin already exists. Skipping...");
      return process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("root1234", 10);

    const admin = new Admin({
      email: "root@admin.com",
      password: hashedPassword,
      role: "root",
      permissions: {
        viewDonations: true,
        manageUsers: true,
        exportData: true
      },
      status: "active"
    });

    await admin.save();
    console.log("✅ Root admin created successfully");
    process.exit(0);
  } catch (err) {
    console.error("❌ Failed to create root admin:", err);
    process.exit(1);
  }
}

seedRootAdmin();
