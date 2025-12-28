const tg = window.Telegram.WebApp;
tg.expand();

let userId = null;

// ================= INIT USER =================
async function init() {
  const res = await fetch("/user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ initData: tg.initDataUnsafe })
  });

  const data = await res.json();

  userId = data.id;
  document.getElementById("balance").innerText = data.balance;
  document.getElementById("energy").innerText = data.energy;
  document.getElementById("level").innerText = data.level;
  document.getElementById("token").innerText = data.token || 0;

  setReferralLink();
  loadLeaderboard();
  loadTopRefs();
  loadStats();
}

init();

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
  document.getElementById("level").innerText = data.level;
}

// ================= DAILY =================
async function daily() {
  const res = await fetch("/daily", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId })
  });

  const data = await res.json();
  if (data.error) return alert(data.error);

  document.getElementById("balance").innerText = data.balance;
  alert("🎁 Daily reward claimed!");
}

// ================= TASKS =================
function openTask(type) {
  if (type === "youtube") window.open("https://youtube.com/@YOURCHANNEL", "_blank");
  if (type === "channel") window.open("https://t.me/TeleAIupdates", "_blank");
  if (type === "group") window.open("https://t.me/tele_tap_ai", "_blank");

  fetch("/task", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, type })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        document.getElementById("balance").innerText = data.balance;
        alert("✅ Task completed!");
      }
    });
}

// ================= REFERRAL =================
function setReferralLink() {
  const link = `https://t.me/YOUR_BOT_USERNAME?start=${userId}`;
  document.getElementById("refLink").value = link;
}

function copyInvite() {
  const input = document.getElementById("refLink");
  input.select();
  document.execCommand("copy");
  alert("Invite link copied!");
}

// ================= LEADERBOARD =================
function loadLeaderboard() {
  fetch("/leaderboard")
    .then(r => r.json())
    .then(data => {
      document.getElementById("board").innerHTML =
        data.map((u, i) => `#${i + 1} — ${u.balance} coins`).join("<br>");
    });
}

// ================= TOP REFERRALS =================
function loadTopRefs() {
  fetch("/top-referrals")
    .then(r => r.json())
    .then(data => {
      document.getElementById("topRefs").innerHTML =
        data.map((u, i) => `#${i + 1} — ${u.referrals} invites`).join("<br>");
    });
}

// ================= TOTAL USERS =================
function loadStats() {
  fetch("/stats")
    .then(r => r.json())
    .then(data => {
      document.getElementById("totalUsers").innerText = data.total;
    });
}
