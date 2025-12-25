const tg = window.Telegram.WebApp;
tg.ready();

// ✅ GASKIYAR TELEGRAM USER ID
const userId = tg.initDataUnsafe?.user?.id;

if (!userId) {
  alert("Telegram user not found");
}

// START / CREATE USER
async function init() {
  const res = await fetch("/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId })
  });
  const data = await res.json();
  loadBalance();
}

// LOAD BALANCE
async function loadBalance() {
  const res = await fetch(`/balance/${userId}`);
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
    return;
  }

  updateBalance(data.balance);
}

// UPDATE UI
function updateBalance(amount) {
  document.getElementById("balance").innerText = amount + " TT";
}

init();
