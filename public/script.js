// 🔹 TELEGRAM USER
const tg = window.Telegram.WebApp;
tg.ready();

// KARBAR TELEGRAM ID KAI TSAYE
const userId = tg.initDataUnsafe?.user?.id;

if (!userId) {
  alert("Telegram user not detected");
}

// ELEMENTS
const balanceEl = document.getElementById("balance");
const tapBtn = document.getElementById("tapBtn");
const withdrawBtn = document.getElementById("withdrawBtn");

// INIT USER
async function initUser() {
  const res = await fetch("/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId })
  });
  const data = await res.json();
  updateBalance(data.balance);
}

// TAP
async function tap() {
  const res = await fetch("/tap", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId })
  });
  const data = await res.json();

  if (data.error) {
    alert(data.error);
  } else {
    updateBalance(data.balance);
  }
}

// WITHDRAW
async function withdraw() {
  const wallet = prompt("Enter your USDT TRC20 wallet:");

  if (!wallet || wallet.length < 10) {
    alert("Invalid wallet");
    return;
  }

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
    updateBalance(0);
  }
}

// UPDATE UI
function updateBalance(amount) {
  balanceEl.innerText = amount + " TT";

  if (amount >= 1000) {
    withdrawBtn.style.display = "block";
  } else {
    withdrawBtn.style.display = "none";
  }
}

// EVENTS
tapBtn.addEventListener("click", tap);
withdrawBtn.addEventListener("click", withdraw);

// START
initUser();
