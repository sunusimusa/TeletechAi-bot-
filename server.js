import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json());

const DB_FILE = "./data.json";

function readDB() {
  return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Create user / start
app.post("/start", (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: "No userId" });

  const db = readDB();
  if (!db[userId]) {
    db[userId] = { balance: 0, lastTap: 0 };
    writeDB(db);
  }
  res.json({ ok: true });
});

// Get balance
app.get("/balance/:userId", (req, res) => {
  const db = readDB();
  const user = db[req.params.userId];
  if (!user) return res.json({ balance: 0 });
  res.json({ balance: user.balance });
});

// Tap
app.post("/tap", (req, res) => {
  const { userId } = req.body;
  const now = Date.now();

  const db = readDB();
  const user = db[userId];
  if (!user) return res.status(400).json({ error: "User not found" });
// sauran app.use(...)

// USER
app.post("/user", ...);

// TAP
app.post("/tap", ...);

// 👉 A NAN KA SAKA SHI 👇

// WITHDRAW (MIN 1000 TT)
app.post("/withdraw", (req, res) => {
  const { userId, wallet } = req.body;

  let users = readJSON(USERS_FILE);
  let withdraws = readJSON(WITHDRAWS_FILE);

  if (!users[userId]) {
    return res.status(400).json({ error: "User not found" });
  }

  if (users[userId].balance < 1000) {
    return res.status(400).json({ error: "Minimum withdraw is 1000 TT" });
  }

  if (!wallet || wallet.length < 10) {
    return res.status(400).json({ error: "Invalid wallet address" });
  }

  withdraws.push({
    userId: userId,
    wallet: wallet,
    amount: users[userId].balance,
    status: "pending",
    time: Date.now()
  });

  users[userId].balance = 0;

  writeJSON(USERS_FILE, users);
  writeJSON(WITHDRAWS_FILE, withdraws);

  res.json({ success: true, msg: "Withdraw request sent" });
});

// 👉 KADA KA SA KOMAI A KASA DA WANNAN
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
  
  // Anti-cheat: 1 tap per second
  if (now - user.lastTap < 1000) {
    return res.status(429).json({ error: "Too fast" });
  }

  user.balance += 1;
  user.lastTap = now;
  writeDB(db);

  res.json({ balance: user.balance });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
