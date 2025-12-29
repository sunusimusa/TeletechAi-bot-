const tg = window.Telegram.WebApp;
tg.expand();

let userId = null;

async function init() {
  const initData = tg.initDataUnsafe;

  if (!initData || !initData.user) {
    alert("Telegram WebApp not detected");
    return;
  }

  const res = await fetch("/user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: initData.user.id,
      start_param: initData.start_param || null
    })
  });

  const data = await res.json();

  if (data.error) {
    alert(data.error);
    return;
  }

  userId = data.telegramId;

  document.getElementById("balance").innerText = data.balance;
  document.getElementById("energy").innerText = data.energy;
  document.getElementById("level").innerText = data.level;

  setReferralLink();
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
  if (type === "youtube") window.open("https://youtube.com/@Sunusicrypto", "_blank");
  if (type === "channel") window.open("https://t.me/TeleAIupdates", "_blank");
  if (type === "group") window.open("https://t.me/tele_tap_ai", "_blank");

  setTimeout(async () => {
    const res = await fetch("/task", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, type })
    });

    const data = await res.json();
    if (data.error) return alert(data.error);

    document.getElementById("balance").innerText = data.balance;
    alert("✅ Task completed!");
  }, 3000);
}

// ================= REFERRAL =================
function setReferralLink() {
  document.getElementById("refLink").value =
    `https://t.me/TeletechAi_bot?start=${userId}`;
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
    .then(res => res.json())
    .then(data => {
      document.getElementById("board").innerHTML =
        data.map((u, i) => `#${i + 1} — ${u.balance} coins`).join("<br>");
    });
}

// ================= TOP REFERRALS =================
function loadTopRefs() {
  fetch("/top-referrals")
    .then(res => res.json())
    .then(data => {
      document.getElementById("topRefs").innerHTML =
        data.map((u, i) => `#${i + 1} — ${u.referrals} invites`).join("<br>");
    });
}

// ================= TOTAL USERS =================
function loadStats() {
  fetch("/stats")
    .then(res => res.json())
    .then(data => {
      document.getElementById("totalUsers").innerText = data.total;
    });
}

function loadTopRefs() {
  fetch("/top-referrals")
    .then(res => res.json())
    .then(data => {
      let html = "";
      data.forEach((u, i) => {
        html += `
          <div class="rank-row">
            <span>#${i + 1}</span>
            <span>${u.telegramId}</span>
            <span>${u.referrals} 👥</span>
          </div>
        `;
      });
      document.getElementById("topRefs").innerHTML = html;
    });
}

loadTopRefs();
