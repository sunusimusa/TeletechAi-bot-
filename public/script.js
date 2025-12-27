const tg = window.Telegram.WebApp;
tg.expand();

let userId = null;

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

  loadBoard();
}

init();

async function tap() {
  const res = await fetch("/tap", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId })
  });
  const data = await res.json();
  document.getElementById("balance").innerText = data.balance;
  document.getElementById("energy").innerText = data.energy;
}

async function daily() {
  const res = await fetch("/daily", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId })
  });
  const data = await res.json();
  alert(data.error || "Reward claimed!");
  document.getElementById("balance").innerText = data.balance;
}

async function loadBoard() {
  const res = await fetch("/leaderboard");
  const data = await res.json();

  document.getElementById("board").innerHTML =
    data.map(u => `${u.id}: ${u.balance}`).join("<br>");
}
