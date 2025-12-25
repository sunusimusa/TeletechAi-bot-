import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const DB_FILE = "./data/users.json";
const WITHDRAW_FILE = "./data/withdraws.json";

// ===== helpers =====
function readJSON(file, fallback) {
  if (!fs.existsSync(file)) return fallback;
  return JSON.parse(fs.readFileSync(file));
}
function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// ===== START USER =====
app.post("/user", (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: "No userId" });

  const users = readJSON(DB_FILE, {});
  if (!users[userId]) {
    users[userId] = { balance: 0, lastTap: 0 };
    writeJSON(DB_FILE, users);
  }
  res.json({ balance: users[userId].balance });
});

// ===== TAP =====
app.post("/tap", (req, res) => {
  const { userId } = req.body;
  const users = readJSON(DB_FILE, {});
  const user = users[userId];

  if (!user) return res.status(400).json({ error: "User not found" });

  const now = Date.now();
  if (now - user.lastTap < 1000) {
    return res.status(429).json({ error: "Too fast" });
  }

  user.balance += 1;
  user.lastTap = now;
  writeJSON(DB_FILE, users);

  res.json({ balance: user.balance });
});

// ===== WITHDRAW =====
app.post("/withdraw", (req, res) => {
  const { userId, wallet } = req.body;

  const users = readJSON(DB_FILE, {});
  const withdraws = readJSON(WITHDRAW_FILE, []);

  if (!users[userId]) {
    return res.status(400).json({ error: "User not found" });
  }

  if (users[userId].balance < 1000) {
    return res.status(400).json({ error: "Minimum withdraw is 1000 TT" });
  }

  if (!wallet || wallet.length < 10) {
    return res.status(400).json({ error: "Invalid wallet" });
  }

  withdraws.push({
    userId,
    wallet,
    amount: users[userId].balance,
    status: "pending",
    time: Date.now()
  });

  users[userId].balance = 0;
  writeJSON(DB_FILE, users);
  writeJSON(WITHDRAW_FILE, withdraws);

  res.json({ success: true });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on", PORT));
