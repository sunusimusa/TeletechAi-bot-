let userId = localStorage.getItem("uid");
if (!userId) {
  userId = Math.floor(Math.random() * 1000000);
  localStorage.setItem("uid", userId);
}

const balanceEl = document.getElementById("balance");
const energyEl = document.getElementById("energy");
const tapBtn = document.getElementById("tapBtn");

let energy = 0;
let balance = 0;

// ================= LOAD USER =================
async function loadUser() {
  const res = await fetch("/user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId })
  });

  const data = await res.json();

  balance = data.balance;
  energy = data.energy;

  updateUI();
}

app.post("/tap", (req, res) => {
  const { userId } = req.body;
  if (!users[userId]) return res.json({ error: "no user" });

  if (users[userId].energy <= 0) {
    return res.json(users[userId]);
  }

  users[userId].energy -= 1;
  users[userId].balance += 1;

  saveUsers();
  res.json(users[userId]);
});
// ================= TAP =================
tapBtn.onclick = async () => {
  if (energy <= 0) return;

  const res = await fetch("/tap", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId })
  });

  const data = await res.json();

  balance = data.balance;
  energy = data.energy;

  tapBtn.classList.add("tap-anim");
  setTimeout(() => tapBtn.classList.remove("tap-anim"), 150);

  updateUI();
};

// ================= UI UPDATE =================
function updateUI() {
  balanceEl.innerText = balance + " TT";
  energyEl.innerText = energy;
}

// ================= AUTO ENERGY REFILL =================
setInterval(async () => {
  const res = await fetch("/user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId })
  });

  const data = await res.json();
  energy = data.energy;
  updateUI();
}, 5000); // every 5 seconds
app.post("/user", (req, res) => {
  const { userId } = req.body;

  if (!users[userId]) {
    users[userId] = {
      balance: 0,
      energy: 100,
      lastEnergy: Date.now(),
      refs: []
    };
  }

  const now = Date.now();
  const diff = Math.floor((now - users[userId].lastEnergy) / 5000); // 5 sec

  if (diff > 0) {
    users[userId].energy = Math.min(100, users[userId].energy + diff);
    users[userId].lastEnergy = now;
  }

  saveUsers();
  res.json(users[userId]);
});

loadUser();
