import express from "express";
import User from "../models/User.js";
import Market from "../models/Market.js";

const router = express.Router();

// ===== INIT MARKET (run once) =====
router.post("/init", async (req, res) => {
  let market = await Market.findOne();
  if (market) return res.json({ error: "MARKET_ALREADY_EXISTS" });

  market = await Market.create({
    reservePoints: 1_000_000,
    reserveJetton: 1_000
  });

  res.json({ success: true, market });
});

// ===== GET PRICE =====
router.get("/price", async (req, res) => {
  const market = await Market.findOne();
  if (!market) return res.json({ error: "MARKET_NOT_READY" });

  const price = market.reservePoints / market.reserveJetton;

  res.json({
    price: Math.round(price),
    reservePoints: market.reservePoints,
    reserveJetton: market.reserveJetton
  });
});

// ===== BUY JETTON =====
router.post("/buy", async (req, res) => {
  const { telegramId, amount } = req.body;

  const user = await User.findOne({ telegramId });
  const market = await Market.findOne();

  if (!user) return res.json({ error: "USER_NOT_FOUND" });
  if (!market) return res.json({ error: "MARKET_NOT_READY" });

  const price = market.reservePoints / market.reserveJetton;
  const cost = Math.ceil(amount * price);

  if (user.balance < cost)
    return res.json({ error: "NOT_ENOUGH_POINTS" });

  // AMM update
  user.balance -= cost;
  user.tokens += amount;

  market.reservePoints += cost;
  market.reserveJetton -= amount;

  await user.save();
  await market.save();

  res.json({
    success: true,
    bought: amount,
    price: Math.round(price),
    balance: user.balance,
    tokens: user.tokens
  });
});

// ===== SELL JETTON =====
router.post("/sell", async (req, res) => {
  const { telegramId, amount } = req.body;

  const user = await User.findOne({ telegramId });
  const market = await Market.findOne();

  if (!user) return res.json({ error: "USER_NOT_FOUND" });
  if (!market) return res.json({ error: "MARKET_NOT_READY" });
  if (user.tokens < amount)
    return res.json({ error: "NOT_ENOUGH_TOKENS" });

  const price = market.reservePoints / market.reserveJetton;
  const payout = Math.floor(amount * price);

  if (market.reservePoints < payout)
    return res.json({ error: "POOL_LOW_LIQUIDITY" });

  // AMM update
  user.tokens -= amount;
  user.balance += payout;

  market.reserveJetton += amount;
  market.reservePoints -= payout;

  await user.save();
  await market.save();

  res.json({
    success: true,
    sold: amount,
    price: Math.round(price),
    balance: user.balance,
    tokens: user.tokens
  });
});

// ===== ADD LIQUIDITY (ADMIN / OWNER) =====
router.post("/liquidity", async (req, res) => {
  const { points, jetton } = req.body;

  const market = await Market.findOne();
  if (!market) return res.json({ error: "MARKET_NOT_READY" });

  market.reservePoints += points;
  market.reserveJetton += jetton;

  await market.save();

  res.json({
    success: true,
    market
  });
});

export default router;
