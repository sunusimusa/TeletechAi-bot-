const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const DB_FILE = "./users.json";

// ==========================
// LOAD USERS
// ==========================
let users = {};
if (fs.existsSync(DB_FILE)) {
  users = JSON.parse(fs.readFileSync(DB_FILE));
}

// ==========================
// SAVE USERS
// ==========================
function saveUsers() {
  fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2));
}

// ==========================
// GET / CREATE USER
// ==========================
app.post("/user", (req, res) => {
  const { userId } = req.body;

  if (!users[userId]) {
    users[userId] = {
      balance: 0,
      energy: 100,
      lastEnergyUpdate: Date.now(),
      refs: []
    };
    saveUsers();
  }

  // Energy regen
  const now = Date.now();
  const diff = Math.floor((now - users[userId].lastEnergyUpdate) / 30000);

  if (diff > 0) {
    users[userId].energy = Math.min(100, users[userId].energy + diff);
    users[userId].lastEnergyUpdate = now;
    saveUsers();
  }

  res.json(users[userId]);
});

// ==========================
// TAP
// ==========================
app.post("/tap", (req, res) => {
  const { userId } = req.body;

  if (!users[userId]) {
    return res.json({ error: "User not found" });
  }

  if (users[userId].energy <= 0) {
    return res.json(users[userId]);
  }

  users[userId].energy -= 1;
  users[userId].balance += 1;

  saveUsers();
  res.json(users[userId]);
});

// ==========================
// REFERRAL COUNT
// ==========================
app.post("/ref-count", (req, res) => {
  const { userId } = req.body;
  const count = users[userId]?.refs?.length || 0;
  res.json({ count });
});

// ==========================
// ADD REFERRAL
// ==========================
app.post("/referral", (req, res) => {
  const { referrerId } = req.body;

  if (users[referrerId]) {
    users[referrerId].refs.push(Date.now());
    users[referrerId].balance += 10;
    saveUsers();
  }

  res.json({ ok: true });
});

// ==========================
// HOME
// ==========================
app.get("/", (req, res) => {
  res.send("TeleTech AI Server Running");
});

// ==========================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
