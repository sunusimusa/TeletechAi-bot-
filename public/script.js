const tg = window.Telegram.WebApp;
tg.expand();

let userId = null;
let tonConnectUI;

// ================= INIT TON =================
tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
  manifestUrl: "https://teletechai-bot.onrender.com/tonconnect-manifest.json"
});

// ================= LOAD USER =================
async function loadUser() {
  const res = await fetch("/user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      initData: tg.initDataUnsafe
    })
  });

  const data = await res.json();
  if (data.error) return alert(data.error);

  userId = data.id;
  document.getElementById("balance").innerText = data.balance;
  document.getElementById("energy").innerText = data.energy;

  setReferralLink();
  loadLeaderboard();
  loadReferrals();
}

loadUser();

// ================= TAP =================
async function tap() {
  if (!userId) return alert("Loading...");

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

  document.getElementById("balance").innerText = data.balance;
}

// ================= TASKS =================
function openTask(type) {
  if (type === "tg") window.open("https://t.me/TeleAIupdates");
  if (type === "yt") window.open("https://youtube.com/@Sunusicrypto");
  if (type === "chat") window.open("https://t.me/tele_tap_ai");

  setTimeout(() => completeTask(type), 3000);
}

async function completeTask(type) {
  const res = await fetch("/task", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, type })
  });

  const data = await res.json();
  if (!data.error) {
    document.getElementById("balance").innerText = data.balance;
  }
}

// ================= REFERRAL =================
function setReferralLink() {
  document.getElementById("refLink").value =
    `https://t.me/YOUR_BOT_USERNAME?start=${userId}`;
}

function copyInvite() {
  const input = document.getElementById("refLink");
  input.select();
  document.execCommand("copy");
  alert("Invite copied!");
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

// ================= CONNECT WALLET =================
async function connectWallet() {
  try {
    const wallet = await tonConnectUI.connectWallet();
    document.getElementById("walletAddress").value = wallet.account.address;

    await fetch("/wallet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        address: wallet.account.address
      })
    });
  } catch (e) {
    alert("Wallet connection cancelled");
  }
}
