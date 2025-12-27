const tg = window.Telegram.WebApp;
tg.expand();

// ===== GET INIT DATA =====
const initData = tg.initData || "";
const initDataUnsafe = tg.initDataUnsafe || {};

// ===== GLOBAL USER ID =====
let userId = null;

// ================= LOAD USER =================
async function loadUser() {
  const res = await fetch("/user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      initData: tg.initData,
    }),
  });

  const data = await res.json();

  if (data.error) {
    alert(data.error);
    return;
  }

  userId = data.id;

  document.getElementById("balance").innerText = data.balance ?? 0;
  document.getElementById("energy").innerText = data.energy ?? 0;

  setReferralLink();
  loadLeaderboard();
  loadReferrals();
}

loadUser();

// ================= TAP =================
async function tap() {
  if (!userId) return alert("User not ready");

  const res = await fetch("/tap", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });

  const data = await res.json();
  if (data.error) return alert(data.error);

  document.getElementById("balance").innerText = data.balance;
  document.getElementById("energy").innerText = data.energy;
}

// ================= DAILY =================
async function claimDaily() {
  const res = await fetch("/daily", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });

  const data = await res.json();
  if (data.error) return alert(data.error);

  document.getElementById("balance").innerText = data.balance;
}

// ================= REFERRAL =================
function setReferralLink() {
  if (!userId) return;
  const link = `https://t.me/YOUR_BOT_USERNAME?start=${userId}`;
  document.getElementById("refLink").value = link;
}

// ================= LEADERBOARD =================
async function loadLeaderboard() {
  const res = await fetch("/leaderboard");
  const data = await res.json();

  document.getElementById("topUsers").innerHTML =
    data.map((u, i) => `🏆 ${i + 1}. ${u.id} — ${u.balance}`).join("<br>");
}

// ================= REFERRALS =================
async function loadReferrals() {
  const res = await fetch("/referrals");
  const data = await res.json();

  document.getElementById("topReferrals").innerHTML =
    data.map((u, i) => `👤 ${i + 1}. ${u.id} — ${u.refs}`).join("<br>");
}

// ================= WALLET =================
async function connectWallet() {
  const tonConnect = new TON_CONNECT_UI.TonConnectUI({
    manifestUrl: window.location.origin + "/tonconnect-manifest.json"
  });

  const wallet = await tonConnect.connectWallet();
  document.getElementById("walletAddress").innerText = wallet.account.address;

  await fetch("/wallet", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId,
      address: wallet.account.address
    }),
  });
    }
