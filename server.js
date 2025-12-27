const express = require("express");
const fs = require("fs");
const crypto = require("crypto");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "PUT_BOT_TOKEN_HERE";

const DB = "./users.json";
const MAX_ENERGY = 100;
const ENERGY_REGEN = 30000;
const DAILY_REWARD = 20;

let users = fs.existsSync(DB) ? JSON.parse(fs.readFileSync(DB)) : {};

function save() {
  fs.writeFileSync(DB, JSON.stringify(users, null, 2));
}

// 🔐 TELEGRAM AUTH
function verifyTelegram(initData) {
  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  params.delete("hash");

  const data = [...params.entries()]
    .sort()
    .map(([k, v]) => `${k}=${v}`)
    .join("\n");

  const secret = crypto.createHash("sha256").update(BOT_TOKEN).digest();
  const check = crypto.createHmac("sha256", secret).update(data).digest("hex");

  return check === hash;
}

// ================= INIT USER =================
app.post("/user", (req, res) => {
  const { initData, ref } = req.body;
  if (!verifyTelegram(initData)) return res.status(403).json({ error: "Invalid" });

  const params = new URLSearchParams(initData);
  const user = JSON.parse(params.get("user"));
  const userId = user.id.toString();

  if (!users[userId]) {
    users[userId] = {
      balance: 0,
      energy: MAX_ENERGY,
      lastEnergy: Date.now(),
      lastDaily: 0,
      wallet: "",
      refs: [],
      withdraws: []
    };

    if (ref && users[ref]) {
      users[ref].refs.push(userId);
      users[ref].balance += 10;
    }
  }

  const now = Date.now();
  const regen = Math.floor((now - users[userId].lastEnergy) / ENERGY_REGEN);
  if (regen > 0) {
    users[userId].energy = Math.min(MAX_ENERGY, users[userId].energy + regen);
    users[userId].lastEnergy += regen * ENERGY_REGEN;
  }

  save();
  res.json(users[userId]);
});

// ================= TAP =================
app.post("/tap", (req, res) => {
  const { userId } = req.body;
  if (!users[userId]) return res.json({ error: "User not found" });

  if (users[userId].energy <= 0)
    return res.json({ error: "No energy" });

  users[userId].energy--;
  users[userId].balance++;

  save();
  res.json(users[userId]);
});

// ================= DAILY =================
app.post("/daily", (req, res) => {
  const { userId } = req.body;
  if (!users[userId]) return res.json({ error: "User not found" });

  if (Date.now() - users[userId].lastDaily < 86400000)
    return res.json({ error: "Already claimed" });

  users[userId].lastDaily = Date.now();
  users[userId].balance += DAILY_REWARD;

  save();
  res.json({ balance: users[userId].balance });
});

// ================= WALLET =================
app.post("/wallet", (req, res) => {
  const { userId, address } = req.body;
  if (!users[userId]) return res.json({ error: "User not found" });

  users[userId].wallet = address;
  save();

  res.json({ success: true });
});

// ================= WITHDRAW =================
app.post("/withdraw", (req, res) => {
  const { userId, amount } = req.body;

  if (!users[userId]) return res.json({ error: "User not found" });
  if (amount < 100) return res.json({ error: "Minimum 100" });
  if (users[userId].balance < amount) return res.json({ error: "Low balance" });

  users[userId].balance -= amount;
  users[userId].withdraws.push({
    amount,
    time: Date.now(),
    status: "pending"
  });

  save();
  res.json({ success: true });
});

// ================= LEADERBOARD =================
app.get("/leaderboard", (req, res) => {
  const list = Object.entries(users)
    .map(([id, u]) => ({ id, balance: u.balance }))
    .sort((a, b) => b.balance - a.balance)
    .slice(0, 10);

  res.json(list);
});

// ================= REFERRALS =================
app.get("/referrals", (req, res) => {
  const list = Object.entries(users)
    .map(([id, u]) => ({ id, refs: u.refs.length }))
    .sort((a, b) => b.refs - a.refs)
    .slice(0, 10);

  res.json(list);
});

app.listen(PORT, () => console.log("🚀 Running on", PORT));
