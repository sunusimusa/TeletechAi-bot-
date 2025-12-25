let userId = "guest";

if (window.Telegram && Telegram.WebApp && Telegram.WebApp.initDataUnsafe) {
  userId = Telegram.WebApp.initDataUnsafe.user.id.toString();
}

const balanceEl = document.getElementById("balance");
const withdrawBtn = document.getElementById("withdrawBtn");
const tapBtn = document.getElementById("tapBtn");

async function init() {
  const res = await fetch("/init", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId })
  });
  const data = await res.json();
  updateUI(data.balance);
}

async function tap() {
  const res = await fetch("/tap", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId })
  });
  const data = await res.json();
  if (!data.error) updateUI(data.balance);
}

async function withdraw() {
  const wallet = prompt("Enter USDT TRC20 wallet");
  if (!wallet) return;

  const res = await fetch("/withdraw", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, wallet })
  });

  const data = await res.json();
  if (data.success) {
    alert("Withdraw sent!");
    updateUI(0);
  } else {
    alert(data.error);
  }
}

function updateUI(balance) {
  balanceEl.innerText = balance;
  withdrawBtn.style.display = balance >= 1000 ? "block" : "none";
}

tapBtn.onclick = tap;
withdrawBtn.onclick = withdraw;

init();
