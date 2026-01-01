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
