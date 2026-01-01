const tg = window.Telegram.WebApp;
tg.expand();

let USER_ID = tg.initDataUnsafe?.user?.id;

async function loadUser() {
  const res = await fetch("/user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ initData: tg.initData })
  });

  const data = await res.json();

  document.getElementById("balance").innerText = data.balance;
  document.getElementById("energy").innerText = data.energy;
}

loadUser();

async function tap() {
  const res = await fetch("/tap", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ initData: tg.initData })
  });

  const data = await res.json();

  if (data.error) return alert(data.error);

  document.getElementById("balance").innerText = data.balance;
  document.getElementById("energy").innerText = data.energy;
}

function daily() {
  fetch("/daily", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ initData: tg.initData })
  }).then(r => r.json()).then(d => {
    alert("🎁 Daily claimed!");
    loadUser();
  });
}

function openFight() {
  window.location.href = "/game/fight.html";
}

function openProfile() {
  alert("Profile coming soon 👤");
}

// ===== FIGHT SYSTEM =====

let playerHP = 100;
let enemyHP = 100;
let level = 1;
let xp = 0;
let xpNeed = 100;

function updateUI() {
  document.getElementById("playerHP").style.width = playerHP + "%";
  document.getElementById("enemyHP").style.width = enemyHP + "%";

  document.getElementById("level").innerText = level;
  document.getElementById("xp").innerText = xp;
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function enemyAI() {
  let dmg = 0;

  if (enemyHP > 60) dmg = rand(5, 10);
  else if (enemyHP > 30) dmg = rand(10, 18);
  else dmg = rand(15, 25);

  if (Math.random() < 0.2) {
    dmg *= 2;
    alert("🔥 Enemy Critical Hit!");
  }

  return dmg;
}

function attack() {
  let playerDamage = rand(10, 20);
  enemyHP -= playerDamage;

  if (enemyHP <= 0) {
    winBattle();
    return;
  }

  let enemyDamage = enemyAI();
  playerHP -= enemyDamage;

  if (playerHP <= 0) {
    loseBattle();
    return;
  }

  updateUI();
}

function winBattle() {
  xp += 40;
  alert("🏆 YOU WIN!");

  if (xp >= xpNeed) {
    level++;
    xp = 0;
    xpNeed += 50;
    alert("🔥 LEVEL UP!");
  }

  resetBattle();
}

function loseBattle() {
  alert("💀 YOU LOST!");
  resetBattle();
}

function resetBattle() {
  playerHP = 100 + level * 5;
  enemyHP = 100 + level * 10;
  updateUI();
}

updateUI();
