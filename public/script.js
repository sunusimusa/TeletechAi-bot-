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
// ===== REWARDED ADS (DEMO) =====
const AD_REWARD = 50;
const AD_LIMIT = 10;

const watchAdBtn = document.getElementById("watchAdBtn");
const adModal = document.getElementById("adModal");
const countdownEl = document.getElementById("countdown");
const closeAdBtn = document.getElementById("closeAdBtn");

const ADS_KEY = "teletech_ads";
let adsData = JSON.parse(localStorage.getItem(ADS_KEY)) || {
  count: 0,
  date: new Date().toDateString()
};

// reset daily ads
if (adsData.date !== new Date().toDateString()) {
  adsData = { count: 0, date: new Date().toDateString() };
  localStorage.setItem(ADS_KEY, JSON.stringify(adsData));
}

watchAdBtn.addEventListener("click", () => {
  if (adsData.count >= AD_LIMIT) {
    alert("❌ Daily ad limit reached");
    return;
  }
  playAd();
});

function playAd() {
  let timeLeft = 15;
  adModal.classList.remove("hidden");
  closeAdBtn.disabled = true;
  closeAdBtn.innerText = "Please wait...";
  countdownEl.innerText = timeLeft;

  const timer = setInterval(() => {
    timeLeft--;
    countdownEl.innerText = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timer);
      finishAd();
    }
  }, 1000);
}

function finishAd() {
  adsData.count++;
  localStorage.setItem(ADS_KEY, JSON.stringify(adsData));

  balance += AD_REWARD;
  localStorage.setItem(STORAGE_KEY, balance);
  updateBalance(balance);

  closeAdBtn.disabled = false;
  closeAdBtn.innerText = "Close & Claim Reward";

  closeAdBtn.onclick = () => {
    adModal.classList.add("hidden");
    alert(`🎉 You earned +${AD_REWARD} TT`);
  };
}
