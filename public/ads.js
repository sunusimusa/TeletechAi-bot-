const tg = window.Telegram?.WebApp;
const TELEGRAM_ID = tg?.initDataUnsafe?.user?.id || "guest";

let seconds = 30;
const timerEl = document.getElementById("timer");
const btn = document.getElementById("claimBtn");

// COUNTDOWN
const interval = setInterval(() => {
  seconds--;
  timerEl.innerText = `⏳ ${seconds} seconds remaining`;

  if (seconds <= 0) {
    clearInterval(interval);
    btn.disabled = false;
    btn.innerText = "⚡ Claim Free Energy";
  }
}, 1000);

// CLAIM ENERGY
async function claimEnergy() {
  btn.disabled = true;
  btn.innerText = "⏳ Processing...";

  const res = await fetch("/api/ads/reward", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ telegramId: TELEGRAM_ID })
  });

  const data = await res.json();

  if (data.error) {
    alert(data.error);
    btn.disabled = false;
    btn.innerText = "⚡ Claim Free Energy";
    return;
  }

  alert("✅ +20 Energy added!");
  goBack();
}

function goBack() {
  window.location.href = "/";
}
