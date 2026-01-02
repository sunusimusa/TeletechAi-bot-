import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log(err));

function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// ================= USER =================
app.post("/api/user", async (req, res) => {
  const { telegramId, ref } = req.body;

  let user = await User.findOne({ telegramId });

  if (!user) {
    user = await User.create({
      telegramId,
      referralCode: generateCode(),
      referredBy: ref || null
    });

    if (ref) {
      const refUser = await User.findOne({ referralCode: ref });
      if (refUser) {
        refUser.balance += 500;
        refUser.referralsCount += 1;
        await refUser.save();
      }
    }
  }

  res.json(user);
});

// ================= DAILY =================
app.post("/api/daily", async (req, res) => {
  const { telegramId } = req.body;
  const user = await User.findOne({ telegramId });

  const now = Date.now();
  const DAY = 86400000;

  if (now - user.lastDaily < DAY)
    return res.json({ error: "COME_BACK_LATER" });

  if (now - user.lastDaily < DAY * 2) {
    user.dailyStreak += 1;
  } else {
    user.dailyStreak = 1;
  }

  user.lastDaily = now;
  const reward = 100 * user.dailyStreak;

  user.balance += reward;
  user.energy += 10;

  await user.save();

  res.json({
    balance: user.balance,
    energy: user.energy,
    streak: user.dailyStreak,
    reward
  });
});

// ================= OPEN BOX =================
app.post("/api/open", async (req, res) => {
  const { telegramId } = req.body;
  const user = await User.findOne({ telegramId });

  if (!user) return res.json({ error: "USER_NOT_FOUND" });

  if (user.freeTries > 0) user.freeTries--;
  else if (user.energy >= 10) user.energy -= 10;
  else return res.json({ error: "NO_ENERGY" });

  const reward = [0, 100, 200][Math.floor(Math.random() * 3)];
  user.balance += reward;

  await user.save();

  res.json({
    reward,
    balance: user.balance,
    energy: user.energy,
    freeTries: user.freeTries
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("🚀 Server running"));
