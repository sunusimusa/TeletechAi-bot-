require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const crypto = require("crypto");

const app = express();
app.use(express.json());
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

// ================== DATABASE ==================
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ Mongo Error:", err));

// ================== MODEL ==================
const User = mongoose.model("User", new mongoose.Schema({
  telegramId: String,
  balance: { type: Number, default: 0 },
  energy: { type: Number, default: 100 },
  level: { type: Number, default: 1 }
}));

// ================== TELEGRAM VERIFY ==================
function verifyTelegram(initData) {
  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  params.delete("hash");

  const dataCheckString = [...params.entries()]
    .sort()
    .map(([k, v]) => `${k}=${v}`)
    .join("\n");

  const secret = crypto
    .createHmac("sha256", "WebAppData")
    .update(process.env.BOT_TOKEN)
    .digest();

  const checkHash = crypto
    .createHmac("sha256", secret)
    .update(dataCheckString)
    .digest("hex");

  if (checkHash !== hash) return null;
  return Object.fromEntries(params);
}

// ================== ROUTES ==================

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/init", async (req, res) => {
  const { initData } = req.body;
  const data = verifyTelegram(initData);
  if (!data) return res.json({ error: "INVALID_USER" });

  let user = await User.findOne({ telegramId: data.user.id });
  if (!user) user = await User.create({ telegramId: data.user.id });

  res.json(user);
});

app.post("/tap", async (req, res) => {
  const data = verifyTelegram(req.body.initData);
  if (!data) return res.json({ error: "INVALID_USER" });

  const user = await User.findOne({ telegramId: data.user.id });
  if (!user) return res.json({ error: "NO_USER" });

  user.balance += 1;
  await user.save();

  res.json({ balance: user.balance });
});

app.post("/fight", async (req, res) => {
  const data = verifyTelegram(req.body.initData);
  if (!data) return res.json({ error: "INVALID_USER" });

  const user = await User.findOne({ telegramId: data.user.id });
  user.balance += 20;
  await user.save();

  res.json({ win: true, balance: user.balance });
});

app.listen(PORT, () => {
  console.log("🚀 Server running on", PORT);
});
