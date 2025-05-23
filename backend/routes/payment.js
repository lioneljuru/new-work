import express from 'express';
import axios from 'axios'; // Added axios import
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Create Donation schema
const donationSchema = new mongoose.Schema({
  name: String,
  email: String,
  amount: Number,
  currency: String,
  paymentMethod: String,
  status: String,
  transaction_id: String,
  createdAt: { type: Date, default: Date.now }
});

const Donation = mongoose.model('Donation', donationSchema);

// Verify payment endpoint
router.post('/verify-payment', async (req, res) => {
  try {
    const { id, currency, amount } = req.body;

    if (!id || !currency || !amount) {
      return res.status(400).json({
        verified: false,
        error: "Missing required parameters"
      });
    }
    
    const response = await axios.get(
      `https://api.flutterwave.com/v3/transactions/${id}/verify`,
      {
        headers: {
          Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`
        }
      }
    );

    const verificationData = response.data.data;
    const isVerified = verificationData.status === "successful" && 
                      verificationData.currency === currency &&
                      verificationData.amount === parseFloat(amount);

    res.status(200).json({ verified: isVerified });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ 
      verified: false,
      error: error.message 
    });
  }
});

// Record donation endpoint
router.post('/record-donation', async (req, res) => {
  try {
    const donation = new Donation({
      ...req.body,
      amount: parseFloat(req.body.amount)
    });

    await donation.save();
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error recording donation:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

router.get('/record-donation', async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.json(donations);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch donations" });
  }
});

export default router;
