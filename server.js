require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const crypto = require("crypto");
const TelegramBot = require("node-telegram-bot-api");

const app = express();
app.use(express.json());
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;
const BOT_TOKEN = process.env.BOT_TOKEN;

// ================== TELEGRAM BOT ==================
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// ================== DATABASE ==================
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ Mongo Error:", err));

// ================== MODEL ==================
const User = mongoose.model("User", new mongoose.Schema({
  telegramId: String,
  balance: { type: Number, default: 0 },
  energy: { type: Number, default: 100 },
  level: { type: Number, default: 1 },
  lastEnergyUpdate: { type: Number, default: Date.now }
}));

// ================== VERIFY TELEGRAM ==================
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
    .update(BOT_TOKEN)
    .digest();

  const checkHash = crypto
    .createHmac("sha256", secret)
    .update(dataCheckString)
    .digest("hex");

  if (checkHash !== hash) return null;

  return Object.fromEntries(params);
}

// ================== BOT COMMAND ==================
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text || "";

  if (text.startsWith("/start")) {
    const param = text.split(" ")[1];

    if (param === "fight") {
      return bot.sendMessage(chatId, "⚔️ Fight Arena", {
        reply_markup: {
          inline_keyboard: [[
            {
              text: "🔥 Open Fight",
              web_app: {
                url: "https://teletechai-bot.onrender.com/game/fight.html"
              }
            }
          ]]
        }
      });
    }

    return bot.sendMessage(chatId, "🚀 Welcome to TeleTech AI", {
      reply_markup: {
        inline_keyboard: [[
          {
            text: "Open App",
            web_app: {
              url: "https://teletechai-bot.onrender.com"
            }
          }
        ]]
      }
    });
  }
});

// ================== INIT USER ==================
app.post("/user", async (req, res) => {
  const { initData } = req.body;
  if (!initData) return res.json({ error: "NO_INIT_DATA" });

  const data = verifyTelegram(initData);
  if (!data) return res.json({ error: "INVALID_USER" });

  const telegramId = data.user.id;

  let user = await User.findOne({ telegramId });
  if (!user) user = await User.create({ telegramId });

  res.json({
    id: user.telegramId,
    balance: user.balance,
    energy: user.energy,
    level: user.level
  });
});

// ================== GAME WIN ==================
app.post("/game-win", async (req, res) => {
  const { initData, reward } = req.body;
  if (!initData) return res.json({ error: "NO_INIT_DATA" });

  const data = verifyTelegram(initData);
  if (!data) return res.json({ error: "INVALID_USER" });

  const user = await User.findOne({ telegramId: data.user.id });
  if (!user) return res.json({ error: "NO_USER" });

  user.balance += reward || 1;
  await user.save();

  res.json({ success: true, balance: user.balance });
});

// ================== START SERVER ==================
app.listen(PORT, () => {
  console.log("🚀 Server running on", PORT);
});
