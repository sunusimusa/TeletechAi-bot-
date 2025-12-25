// ===== TELEGRAM USER =====
const userId = "1248500925"; // daga Telegram (naka)

// ===== STORAGE =====
let balance = 0;

// ===== INIT =====
async function init() {
  const res = await fetch("/user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId })
  });

  const data = await res.json();
  balance = data.balance;
  updateBalance(balance);
}

async function tap() {
  const res = await fetch("/tap", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId })
  });

  const data = await res.json();
  if (data.error) return;

  balance = data.balance;
  updateBalance(balance);
}

async function withdraw() {
  const wallet = prompt("Enter USDT TRC20 wallet:");
  if (!wallet) return;

  const res = await fetch("/withdraw", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, wallet })
  });

  const data = await res.json();
  if (data.error) {
    alert(data.error);
  } else {
    alert("Withdraw request sent!");
    balance = 0;
    updateBalance(balance);
  }
}

function updateBalance(val) {
  document.getElementById("balance").innerText = val + " TT";

  const wBtn = document.getElementById("withdrawBtn");
  if (val >= 1000) {
    wBtn.style.display = "block";
  } else {
    wBtn.style.display = "none";
  }
}

init();
