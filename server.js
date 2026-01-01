import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// ================= DATABASE =================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ Mongo Error:", err));

// ================= USER MODEL =================
const UserSchema = new mongoose.Schema({
  telegramId: { type: String, unique: true },

  balance: { type: Number, default: 0 },
  energy: { type: Number, default: 100 },
  freeTries: { type: Number, default: 3 },
  tokens: { type: Number, default: 0 },

  lastEnergy: { type: Number, default: Date.now }
});

const User = mongoose.model("User", UserSchema);

// ================= ENERGY REGEN =================
function regenEnergy(user) {
  const now = Date.now();
  const diff = Math.floor((now - user.lastEnergy) / 300000); // 5 min

  if (diff > 0) {
    user.energy = Math.min(100, user.energy + diff * 5);
    user.lastEnergy = now;
  }
}

// ================= CREATE / LOAD USER =================
app.post("/api/user", async (req, res) => {
  const { telegramId } = req.body;
  if (!telegramId) return res.json({ error: "NO_USER" });

  let user = await User.findOne({ telegramId });
  if (!user) user = await User.create({ telegramId });

  regenEnergy(user);
  await user.save();

  res.json({
    balance: user.balance,
    energy: user.energy,
    freeTries: user.freeTries,
    tokens: user.tokens
  });
});

// ================= OPEN BOX =================
app.post("/api/open", async (req, res) => {
  const { telegramId } = req.body;
  const user = await User.findOne({ telegramId });

  if (!user) return res.json({ error: "USER_NOT_FOUND" });

  regenEnergy(user);

  if (user.freeTries > 0) {
    user.freeTries--;
  } else if (user.energy >= 10) {
    user.energy -= 10;
  } else {
    return res.json({ error: "NO_ENERGY" });
  }

  const rewards = [
    { type: "coin", value: 100 },
    { type: "coin", value: 200 },
    { type: "nothing", value: 0 }
  ];

  const reward = rewards[Math.floor(Math.random() * rewards.length)];

  if (reward.type === "coin") {
    user.balance += reward.value;
  }

  await user.save();

  res.json({
    reward,
    balance: user.balance,
    energy: user.energy,
    freeTries: user.freeTries
  });
});

// ================= CONVERT TO TOKEN =================
app.post("/api/convert", async (req, res) => {
  const { telegramId } = req.body;
  const user = await User.findOne({ telegramId });

  if (!user) return res.json({ error: "USER_NOT_FOUND" });

  if (user.balance < 10000)
    return res.json({ error: "NOT_ENOUGH_POINTS" });

  user.balance -= 10000;
  user.tokens += 1;

  await user.save();

  res.json({
    tokens: user.tokens,
    balance: user.balance
  });
});

app.post("/api/withdraw", async (req, res) => {
  const { telegramId, amount, wallet } = req.body;

  if (!telegramId || !amount || !wallet) {
    return res.json({ error: "Missing data" });
  }

  const user = await User.findOne({ telegramId });
  if (!user) return res.json({ error: "User not found" });

  if (amount < 1) {
    return res.json({ error: "Minimum withdraw is 1 token" });
  }

  if (user.tokens < amount) {
    return res.json({ error: "Not enough tokens" });
  }

  // subtract tokens
  user.tokens -= amount;

  // save withdraw request
  user.withdrawals.push({
    amount,
    wallet,
    status: "pending"
  });

  await user.save();

  res.json({
    success: true,
    message: "Withdraw request submitted",
    tokens: user.tokens
  });
});

// ================= START SERVER =================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 Server running on port", PORT);
});
