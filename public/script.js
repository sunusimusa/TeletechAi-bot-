const tg = window.Telegram.WebApp;
tg.expand();

const userId = tg.initDataUnsafe.user?.id;

async function loadUser() {
  const res = await fetch("/user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId })
  });

  const data = await res.json();
  document.getElementById("energy").innerText = data.energy;
  document.getElementById("balance").innerText = data.balance;
}

async function tap() {
  const res = await fetch("/tap", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId })
  });

  const data = await res.json();
  document.getElementById("energy").innerText = data.energy;
  document.getElementById("balance").innerText = data.balance;
}

loadUser();
