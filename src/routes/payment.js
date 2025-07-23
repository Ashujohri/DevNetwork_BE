const express = require("express");
const { userAuth } = require("../middlewares/auth");
const router = express.Router();
const razorPayInstance = require("../util/razorpay");
const Payment = require("../models/payments");
const { membershipAmount } = require("../util/constants");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");
const User = require("../models/user");

router.post("/payment/create", userAuth, async (req, res) => {
  try {
    const { membershipType } = req.body;
    const { firstname, lastname, email } = req.user;
    const order = await razorPayInstance.orders.create({
      amount: membershipAmount[membershipType] * 100, // Convert to paisa (hundredth of INR)
      currency: "INR",
      receipt: "receipt#1",
      partial_payment: false,
      notes: {
        firstname: firstname,
        lastname: lastname,
        email: email,
        membershipType: membershipType,
      },
    });

    const payment = new Payment({
      user: req.user._id,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      status: order.status,
      receipt: order.receipt,
      notes: order.notes,
    });

    const savedPayment = await payment.save();

    res.json({ ...savedPayment.toJson(), keyId: process.env.RAZORPAY_KEY_ID });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

router.post("/payment/webhook", async (req, res) => {
  try {
    const webhookSignature = req.headers["X-Razorpay-Signature"];
    const iswebhookValid = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SECRET
    );
    if (!iswebhookValid) {
      return res.status(401).json({ message: "Invalid webhook signature" });
    }
    const paymentDetails = req.body.payload.payment.entity;

    const payment = await Payment.findOne({ orderId: paymentDetails.order_id });
    payment.status = paymentDetails.status;
    await payment.save();

    const user = await User.findOne({ _id: payment.user });
    user.isPremium = true;
    user.membershipType = payment.notes.membershipType;
    await user.save();

    // if (req.body.event === "payment.captured") {
    // }
    // if (req.body.event === "payment.failed") {
    // }

    return res.status(200).json({ message: "Webhook received successfully" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

router.get("/payment/verify", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (user.isPremium) {
      return res.json({ isPremium: true });
    }
    return res.json({ isPremium: false });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

module.exports = router;
