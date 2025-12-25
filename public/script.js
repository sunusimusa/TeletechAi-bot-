const userId = "demo-user"; // daga Telegram zaka maye gurbinsa

async function init() {
  const res = await fetch("/user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId })
  });
  const data = await res.json();
  updateBalance(data.balance);
}

async function tap() {
  const res = await fetch("/tap", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId })
  });
  const data = await res.json();
  updateBalance(data.balance);
}

function updateBalance(amount) {
  document.getElementById("balance").innerText = amount + " TT";
}

init();
