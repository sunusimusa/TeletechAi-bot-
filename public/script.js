// ==========================
// USER ID
// ==========================
let userId = localStorage.getItem("uid");

if (!userId) {
  userId = Math.floor(Math.random() * 1000000);
  localStorage.setItem("uid", userId);
}

// ==========================
// ENERGY CONFIG
// ==========================
const MAX_ENERGY = 100;
const ENERGY_REGEN_TIME = 30000; // 30 seconds

// ==========================
// LOAD USER
// ==========================
async function loadUser() {
  const res = await fetch("/user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId })
  });

  const data = await res.json();

  document.getElementById("balance").innerText = data.balance;
  document.getElementById("energy").innerText = data.energy;

  localStorage.setItem("energy", data.energy);
  localStorage.setItem("lastEnergy", Date.now());
}

// ==========================
// TAP FUNCTION
// ==========================
async function tap() {
  let energy = parseInt(localStorage.getItem("energy") || 0);

  if (energy <= 0) {
    alert("⚡ Energy ya ƙare!");
    return;
  }

  const res = await fetch("/tap", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId })
  });

  const data = await res.json();

  document.getElementById("balance").innerText = data.balance;

  energy--;
  localStorage.setItem("energy", energy);
  document.getElementById("energy").innerText = energy;
}

// ==========================
// ENERGY AUTO REFILL
// ==========================
setInterval(() => {
  let energy = parseInt(localStorage.getItem("energy") || 0);

  if (energy < MAX_ENERGY) {
    energy++;
    localStorage.setItem("energy", energy);
    document.getElementById("energy").innerText = energy;
  }
}, ENERGY_REGEN_TIME);

// ==========================
loadUser();
