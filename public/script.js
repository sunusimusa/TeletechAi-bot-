const tg = window.Telegram.WebApp;
tg.expand();

const user = tg.initDataUnsafe.user;
const userId = user.id;

// get ref id
const params = new URLSearchParams(window.location.search);
const ref = params.get("ref");

async function loadUser() {
  const res = await fetch("/user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, ref })
  });

  const data = await res.json();
  document.getElementById("balance").innerText = data.balance;
  document.getElementById("energy").innerText = data.energy;
}

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

document.getElementById("refLink").value =
  `https://t.me/YOUR_BOT_USERNAME?start=${userId}`;

loadUser();
