import express from "express";
import User from "../models/User.js";

const router = express.Router();

// ===== TON WITHDRAW =====
router.post("/withdraw", async (req, res) => {
  const { telegramId, wallet, amount } = req.body;

  if (!telegramId || !wallet || !amount) {
    return res.json({ error: "MISSING_FIELDS" });
  }

  const user = await User.findOne({ telegramId });
  if (!user) return res.json({ error: "USER_NOT_FOUND" });

  if (amount <= 0) {
    return res.json({ error: "INVALID_AMOUNT" });
  }

  if (user.tokens < amount) {
    return res.json({ error: "NOT_ENOUGH_TOKENS" });
  }

  // 🔒 CIRE TOKENS
  user.tokens -= amount;

  // 🧾 AJIYE REQUEST
  user.withdrawals.push({
    amount,
    wallet,
    status: "pending",
    date: new Date()
  });

  await user.save();

  res.json({
    success: true,
    message: "Withdraw request submitted. Pending approval."
  });
});
export default router;
