// ================== TELEGRAM ==================
const TELEGRAM_ID =
  window.Telegram?.WebApp?.initDataUnsafe?.user?.id || "guest";

// ================== GLOBAL STATE ==================
let balance = 0;
let energy = 0;
let tokens = 0;
let freeTries = 0;
let referralCode = "";
let referralsCount = 0;
let soundEnabled = true;

// ================== INIT ==================
document.addEventListener("DOMContentLoaded", () => {
  loadUser();
});

// ================== LOAD USER ==================
async function loadUser() {
  const res = await fetch("/api/user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ telegramId: TELEGRAM_ID })
  });

  const data = await res.json();

  if (data.error) {
    alert("Failed to load user");
    return;
  }

  balance = data.balance ?? 0;
  energy = data.energy ?? 0;
  tokens = data.tokens ?? 0;
  freeTries = data.freeTries ?? 0;
  referralCode = data.referralCode ?? "";
  referralsCount = data.referralsCount ?? 0;

  if (referralCode) {
    document.getElementById("refLink").value =
      `https://t.me/teletechai_bot?start=${referralCode}`;
  }

  updateUI();
}

// ================== UPDATE UI ==================
function updateUI() {
  document.getElementById("balance").innerText = `Balance: ${balance}`;
  document.getElementById("energy").innerText = `Energy: ${energy}`;
  document.getElementById("tokens").innerText = `Tokens: ${tokens}`;
  document.getElementById("refCount").innerText =
    `👥 Referrals: ${referralsCount}`;
}

// ================== SOUND ==================
function playSound(type) {
  if (!soundEnabled) return;

  const map = {
    click: "clickSound",
    win: "winSound",
    lose: "loseSound",
    error: "errorSound"
  };

  const el = document.getElementById(map[type]);
  if (!el) return;

  el.currentTime = 0;
  el.play().catch(() => {});
}

// ================== OPEN BOX ==================
async function openBox(box) {
  if (box.classList.contains("opened")) return;

  playSound("click");

  const res = await fetch("/api/open", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ telegramId: TELEGRAM_ID })
  });

  const data = await res.json();

  if (data.error) {
    playSound("error");
    document.getElementById("msg").innerText = data.error;
    return;
  }

  box.classList.add("opened");

  if (data.reward === 0) {
    box.innerText = "😢";
    playSound("lose");
  } else {
    box.innerText = `💰 ${data.reward}`;
    playSound("win");
  }

  balance = data.balance;
  energy = data.energy;
  freeTries = data.freeTries;

  updateUI();

  setTimeout(() => {
    box.classList.remove("opened");
    box.innerText = "";
  }, 3000);
}

// ================== DAILY BONUS ==================
async function claimDaily() {
  const res = await fetch("/api/daily", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ telegramId: TELEGRAM_ID })
  });

  const data = await res.json();

  if (data.error) {
    document.getElementById("dailyMsg").innerText = data.error;
    return;
  }

  balance = data.balance;
  energy = data.energy;

  document.getElementById("dailyMsg").innerText =
    `🎉 +${data.reward}`;

  updateUI();
}

// ================== CONVERT POINTS ==================
async function convertPoints() {
  const res = await fetch("/api/convert", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ telegramId: TELEGRAM_ID })
  });

  const data = await res.json();

  if (data.error) {
    alert(data.error);
    return;
  }

  balance = data.balance;
  tokens = data.tokens;
  updateUI();
}

// ================== COPY REF ==================
function copyRef() {
  navigator.clipboard.writeText(
    document.getElementById("refLink").value
  );
  alert("Referral link copied");
}

async function buyToken(amount = 1) {
  const res = await fetch("/api/market/buy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ telegramId: TELEGRAM_ID, amount })
  });

  const data = await res.json();
  if (data.error) return alert(data.error);

  balance = data.balance;
  tokens = data.tokens;
  updateUI();
}

async function sellToken(amount = 1) {
  const res = await fetch("/api/market/sell", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ telegramId: TELEGRAM_ID, amount })
  });

  const data = await res.json();
  if (data.error) return alert(data.error);

  balance = data.balance;
  tokens = data.tokens;
  updateUI();
}

async function convertPoints() {
  const res = await fetch("/api/convert", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ telegramId: TELEGRAM_ID })
  });

  const data = await res.json();
  if (data.error) return alert(data.error);

  balance = data.balance;
  tokens = data.tokens;
  updateUI();
}

async function buyEnergy(amount) {
  const res = await fetch("/api/buy-energy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ telegramId: TELEGRAM_ID, amount })
  });

  const data = await res.json();
  if (data.error) return alert(data.error);

  balance = data.balance;
  energy = data.energy;
  updateUI();
}

function joinYouTube() {
  Telegram.WebApp.openLink("https://youtube.com/@Sunusicrypto");
  setTimeout(async () => {
    const res = await fetch("/api/task/youtube", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telegramId: TELEGRAM_ID })
    });
    const data = await res.json();
    if (!data.error) {
      tokens = data.tokens;
      updateUI();
      alert("+10 TOKEN");
    }
  }, 4000);
}

function joinGroup() {
  Telegram.WebApp.openLink("https://t.me/tele_tap_ai");
  setTimeout(async () => {
    const res = await fetch("/api/task/group", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telegramId: TELEGRAM_ID })
    });
    const data = await res.json();
    if (!data.error) {
      tokens = data.tokens;
      updateUI();
      alert("+5 TOKEN");
    }
  }, 4000);
}

function joinChannel() {
  Telegram.WebApp.openLink("https://t.me/TeleAIupdates");
  setTimeout(async () => {
    const res = await fetch("/api/task/channel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telegramId: TELEGRAM_ID })
    });
    const data = await res.json();
    if (!data.error) {
      tokens = data.tokens;
      updateUI();
      alert("+5 TOKEN");
    }
  }, 4000);
}
