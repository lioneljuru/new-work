import jwt from 'jsonwebtoken';
import Admin from '../models/AdminModel.js';

export const authenticateAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied, No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);
    if(!admin) return res.status(401).json({ error: "Admin not found" });

    req.adminId = decoded.id;
    req.user = admin;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};
/*
export const onlySuperAdmin = (req, res, next) => {
  if (!req.adminId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (req.user?.role !== 'root') {
    return res.status(403).json({ error: "Forbidden." });
  }

  next();
};*/
export const onlySuperAdmin = async (req, res, next) => {
  try {
    console.log("🧪 Checking admin ID:", req.adminId);
    const admin = await Admin.findById(req.adminId);
    console.log("👤 Found Admin:", admin);

    if (!admin || admin.role !== 'root') {
      return res.status(403).json({ error: "Root admin access only" });
    }
    next();
  } catch (err) {
    res.status(500).json({ error: "Middleware check failed", detail: err.message });
  }
};

