// ================= TELEGRAM INIT =================
const tg = window.Telegram.WebApp;
tg.expand();

// Telegram user data
const initData = tg.initData;

// GLOBALS
let userId = null;

// ================= INIT USER =================
async function initUser() {
  const res = await fetch("/user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ initData })
  });

  const data = await res.json();

  if (data.error) {
    alert("Auth error");
    return;
  }

  userId = data.id;

  document.getElementById("balance").innerText = data.balance;
  document.getElementById("energy").innerText = data.energy;

  setReferralLink();
  loadLeaderboard();
  loadReferrals();
}

initUser();

// ================= TAP =================
async function tap() {
  const res = await fetch("/tap", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId })
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
    body: JSON.stringify({ userId })
  });

  const data = await res.json();
  if (data.error) return alert(data.error);

  alert("🎁 Daily reward claimed!");
  document.getElementById("balance").innerText = data.balance;
}

// ================= TASKS =================
function openTask(type) {
  if (type === "tg") window.open("https://t.me/TeleAIupdates", "_blank");
  if (type === "yt") window.open("https://youtube.com/@Sunusicrypto", "_blank");
  if (type === "chat") window.open("https://t.me/tele_tap_ai", "_blank");

  document.getElementById("taskMsg").innerText = "✅ Task completed!";
}

// ================= REFERRAL =================
function setReferralLink() {
  const link = `${window.location.origin}?ref=${userId}`;
  document.getElementById("refLink").value = link;
}

function copyLink() {
  const input = document.getElementById("refLink");
  input.select();
  document.execCommand("copy");
  alert("Referral link copied!");
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

// ================= TON WALLET =================
const tonConnect = new TON_CONNECT_UI.TonConnectUI({
  manifestUrl: window.location.origin + "/tonconnect-manifest.json"
});

async function connectWallet() {
  const wallet = await tonConnect.connectWallet();
  document.getElementById("walletAddress").innerText = wallet.account.address;

  await fetch("/wallet", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId,
      address: wallet.account.address
    })
  });
}
