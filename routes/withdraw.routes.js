import express from "express";
import User from "../models/User.js";

const router = express.Router();

// ===== WITHDRAW REQUEST (SAFE / PENDING) =====
router.post("/withdraw", async (req, res) => {
  try {
    const { telegramId, wallet, amount } = req.body;

    if (!telegramId || !wallet || amount === undefined) {
      return res.status(400).json({ error: "MISSING_FIELDS" });
    }

    const withdrawAmount = Number(amount);
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      return res.status(400).json({ error: "INVALID_AMOUNT" });
    }

    const user = await User.findOne({ telegramId });
    if (!user) {
      return res.status(404).json({ error: "USER_NOT_FOUND" });
    }

    if (user.tokens < withdrawAmount) {
      return res.status(400).json({ error: "NOT_ENOUGH_TOKENS" });
    }

    // 🔒 CIRE TOKENS
    user.tokens -= withdrawAmount;

    // 🧾 TABBATAR withdrawals ARRAY
    if (!user.withdrawals) user.withdrawals = [];

    user.withdrawals.push({
      amount: withdrawAmount,
      wallet,
      status: "pending",
      createdAt: new Date()
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: "Withdraw request submitted. Pending approval."
    });

  } catch (err) {
    console.error("Withdraw error:", err);
    res.status(500).json({ error: "SERVER_ERROR" });
  }
});

export default router;
