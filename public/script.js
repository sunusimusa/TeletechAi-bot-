const tg = window.Telegram.WebApp;
tg.expand();

let userId = null;
let balance = 0;
let energy = 0;

// ================= INIT USER =================
async function init() {
  const res = await fetch("/user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      initData: tg.initDataUnsafe
    })
  });

  const data = await res.json();

  if (!data || data.error) {
    alert("Failed to load user");
    return;
  }

  userId = data.id;
  balance = data.balance ?? 0;
  energy = data.energy ?? 0;

  updateUI();
  setReferral();
  loadBoard();
}

init();

// ================= UPDATE UI =================
function updateUI() {
  document.getElementById("balance").innerText = balance;
  document.getElementById("energy").innerText = energy;
  updateEnergyBar();
}

// ================= TAP =================
async function tap() {
  if (energy <= 0) return alert("No energy");

  const res = await fetch("/tap", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId })
  });

  const data = await res.json();

  if (data.error) return alert(data.error);

  balance = data.balance;
  energy = data.energy;
  updateUI();
}

// ================= DAILY =================
async function daily() {
  const res = await fetch("/daily", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId })
  });

  const data = await res.json();
  if (data.error) return alert(data.error);

  balance = data.balance;
  updateUI();
}

// ================= ENERGY BAR =================
function updateEnergyBar() {
  const percent = Math.min(100, (energy / 100) * 100);
  document.getElementById("energyFill").style.width = percent + "%";
}

// ================= REFERRAL =================
function setReferral() {
  document.getElementById("refLink").value =
    `https://t.me/teletechai_bot?start=${userId}`;
}

// ================= LEADERBOARD =================
async function loadBoard() {
  const res = await fetch("/leaderboard");
  const data = await res.json();

  document.getElementById("board").innerHTML =
    data.map(u => `🏆 ${u.id} — ${u.balance}`).join("<br>");
}

// ================= COPY =================
function copyInvite() {
  const el = document.getElementById("refLink");
  el.select();
  document.execCommand("copy");
  alert("Copied!");
}
