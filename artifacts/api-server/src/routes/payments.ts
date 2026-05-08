import { Router } from "express";
import Razorpay from "razorpay";
import { db, studentsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import crypto from "crypto";

const router = Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

// Create Order
router.post("/create-order", async (req, res) => {
  const { amount, planId } = req.body;
  
  try {
    const options = {
      amount: amount * 100, // in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: { planId }
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    res.status(500).json({ error: "Failed to create payment order" });
  }
});

// Verify Payment
router.post("/verify-payment", async (req, res) => {
  const { 
    razorpay_order_id, 
    razorpay_payment_id, 
    razorpay_signature,
    studentId,
    planId
  } = req.body;

  const sign = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
    .update(sign.toString())
    .digest("hex");

  if (razorpay_signature === expectedSign) {
    // Payment verified, upgrade student
    await db.update(studentsTable)
      .set({ subscriptionStatus: planId })
      .where(eq(studentsTable.id, parseInt(studentId)));
    
    res.json({ success: true, message: "Payment verified and profile upgraded" });
  } else {
    res.status(400).json({ error: "Invalid payment signature" });
  }
});

export default router;
