import mongoose from "mongoose";

const adminLogSchema = new mongoose.Schema({
  action: String, // "invite", "delete", "accept"
  targetEmail: String,
  actorEmail: String,
  createdAt: { type: Date, default: Date.now },
  meta: Object,
  clientInfo: {
    ip: String,
    userAgent: String,
  },
});

export default mongoose.model("AdminLog", adminLogSchema);