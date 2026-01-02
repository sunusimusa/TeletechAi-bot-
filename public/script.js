const TELEGRAM_ID =
  window.Telegram?.WebApp?.initDataUnsafe?.user?.id || "guest";

let balance = 0;
let energy = 0;
let tokens = 0;
let referralsCount = 0;
let referralCode = "";

document.addEventListener("DOMContentLoaded", loadUser);

async function loadUser() {
  const res = await fetch("/api/user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ telegramId: TELEGRAM_ID })
  });

  const data = await res.json();

  balance = data.balance;
  energy = data.energy;
  tokens = data.tokens;
  referralsCount = data.referralsCount;
  referralCode = data.referralCode;

  document.getElementById("refLink").value =
    `https://t.me/teletechai_bot?start=${referralCode}`;

  document.getElementById("refCount").innerText =
    "👥 Referrals: " + referralsCount;

  updateUI();
}

function updateUI() {
  document.getElementById("balance").innerText = `Balance: ${balance}`;
  document.getElementById("energy").innerText = `Energy: ${energy}`;
  document.getElementById("tokens").innerText = `Tokens: ${tokens}`;
}

function copyRef() {
  navigator.clipboard.writeText(
    document.getElementById("refLink").value
  );
  alert("Copied!");
}
