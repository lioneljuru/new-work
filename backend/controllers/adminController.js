import crypto from "crypto";
import Admin from "../models/AdminModel.js";
import AdminLog from "../models/AdminLog.js";
import sendEmail from "../utils/sendEmail.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const sendInvitation = async (req, res) => {
  if (req.user.role !== "root") return res.status(403).json({ error: "Root access required" });

  const { email, permissions } = req.body;
  const token = crypto.randomBytes(20).toString("hex");

  const existing = await Admin.findOne({ email });
  if (existing) return res.status(400).json({ error: "Admin already exists" });

  await Admin.create({
    email,
    invitationToken: token,
    invitationExpires: Date.now() + 60 * 60 * 1000,
    permissions,
    invitedBy: req.adminId,
  });

  await sendEmail({
    to: email,
    subject: "Admin Portal Invitation",
    html: `<a href="${process.env.APP_URL}/admin/accept-invite?token=${token}">Accept Invitation</a>`,
  });

  await AdminLog.create({
    action: "invite",
    actorEmail: req.user.email,
    targetEmail: email,
    clientInfo: {
      ip: req.ip,
      userAgent: req.headers["user-agent"]
    }
  });

  res.json({ message: "Invitation sent" });
};

export const resendAdminInvite = async (req, res) => {
  const { email } = req.body;
  const admin = await Admin.findOne({ email });

  if (!admin || !admin.invitationToken) {
    return res.status(404).json({ error: "No invite found for this user" });
  }

  const newToken = crypto.randomBytes(20).toString("hex");
  admin.invitationToken = newToken;
  admin.invitationExpires = Date.now() + 3600000;
  await admin.save();

  await sendEmail({
    to: email,
    subject: "Resend Admin Invite",
    html: `<a href="${process.env.APP_URL}/admin/accept-invite?token=${newToken}">Accept Invitation</a>`,
  });

  await AdminLog.create({
    action: "resend_invite",
    actorEmail: req.user.email,
    targetEmail: email,
    clientInfo: {
      ip: req.ip,
      userAgent: req.headers["user-agent"]
    }
  });

  res.json({ message: "Invitation resent" });
};

export const changeAdminPassword = async (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ error: "Password required" });

  const admin = await Admin.findById(req.adminId);
  admin.password = password;
  await admin.save();

  await AdminLog.create({
    action: "change_password",
    actorEmail: admin.email,
    clientInfo: {
      ip: req.ip,
      userAgent: req.headers["user-agent"]
    }
  });

  res.json({ message: "Password updated" });
};

export const updateAdminRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!["admin", "root"].includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }

  await Admin.findByIdAndUpdate(id, { role });

  await AdminLog.create({
    action: "update_role",
    actorEmail: req.user.email,
    targetEmail: id,
    meta: { role },
    clientInfo: {
      ip: req.ip,
      userAgent: req.headers["user-agent"]
    }
  });

  res.json({ message: "Role updated" });
};

export const updateAdminStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["active", "inactive"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  await Admin.findByIdAndUpdate(id, { status });

  await AdminLog.create({
    action: "update_status",
    actorEmail: req.user.email,
    targetEmail: id,
    meta: { status },
    clientInfo: {
      ip: req.ip,
      userAgent: req.headers["user-agent"]
    }
  });

  res.json({ message: "Status updated" });
};

export const getAllDonations = async (req, res) => {
  try {
    const donations = await mongoose.connection
      .collection("donations")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    res.json(donations);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch donations" });
  }
};

export const acceptAdminInvite = async (req, res) => {
  const { token, password, name } = req.body;

  if (!token || !password || !name) {
    return res.status(400).json({ error: "Token, name, and password are required" });
  }

  try {
    const admin = await Admin.findOne({
      invitationToken: token,
      invitationExpires: { $gt: Date.now() },
    });

    if (!admin) {
      return res.status(400).json({ error: "Invitation expired or invalid." });
    }

    // Update admin fields
    admin.password = await bcrypt.hash(password, 10);
    admin.invitationToken = undefined;
    admin.invitationExpires = undefined;
    admin.name = name;
    admin.status = "active";
    admin.lastLogin = new Date();

    await admin.save();

    await AdminLog.create({
      action: "accept_invite",
      actorEmail: admin.email,
      targetEmail: admin.email,
      clientInfo: {
        ip: req.ip,
        userAgent: req.headers["user-agent"]
      }
    });

    res.json({ message: "Admin account created successfully."});
  } catch (err) {
    console.error("Accept invite Error:", err);
    res.status(500).json({ error: "Server error during invite acceptance." });
  }
};

export const getAdminLogs = async (req, res) => {
  try {
    const { action, from, to } = req.query;

    const query = {};

    if (action) query.action = action;

    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) query.createdAt.$lte = new Date(to);
    }

    const logs = await AdminLog.find(query).sort({ createdAt: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch logs" });
  }
};

export const deleteAdmin = async (req, res) => {
  const { id } = req.params;

  try {
    const target = await Admin.findById(id);
    if (!target) {
      return res.status(404).json({ error: "Admin not found" });
    }

    if (target.role === "root") {
      return res.status(403).json({ error: "Cannot delete root admin" });
    }

    await target.deleteOne();

    await AdminLog.create({
      action: "delete",
      actorEmail: req.adminId, // You can replace with email if available
      targetEmail: target.email,
      clientInfo: {
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      },
    });

    res.json({ success: true, message: "Admin deleted" });
  } catch (error) {
    console.error("❌ Delete admin error:", error);
    res.status(500).json({ error: "Failed to delete admin" });
  }
};

export const getAllAdmins = async (req, res) => {
  try {
    const admin = await Admin.find({}, "-password -invitationToken -invitationExpires");
    res.json(admin);
  } catch (err) {
    console.error("❌ Failed to fetch admin", err);
    res.status(500).json({ error: "Failed to fetch admin users" });
  }
};

export const loginAdmin = async (req, res) => {
  console.log("Login request:", req.body);
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    // Update last login time
    admin.lastLogin = new Date();
    await admin.save();

    res.json({
      token,
      user: {
        id: admin._id,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin,
      },
    });
  } catch (err) {
    console.error("❌ Admin login failed", err);
    res.status(500).json({ error: "Login failed" });
  }
};