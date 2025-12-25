// ================= TELEGRAM USER =================
let userId = "1248500925"; // TEMP: naka ID (daga Telegram)

// idan a Mini App ne
if (window.Telegram && Telegram.WebApp) {
  Telegram.WebApp.ready();

  if (Telegram.WebApp.initDataUnsafe?.user?.id) {
    userId = Telegram.WebApp.initDataUnsafe.user.id.toString();
  }
}

// ================= INIT USER =================
async function init() {
  const res = await fetch("/user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId })
  });

  const data = await res.json();
  updateBalance(data.balance);
  checkWithdraw(data.balance);
}

// ================= TAP =================
async function tap() {
  const res = await fetch("/tap", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId })
  });

  const data = await res.json();

  if (data.error) {
    alert(data.error);
    return;
  }

  updateBalance(data.balance);
  checkWithdraw(data.balance);
}

// ================= WITHDRAW =================
async function withdraw() {
  const wallet = prompt("Enter your USDT TRC20 wallet");

  if (!wallet) return;

  const res = await fetch("/withdraw", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId,
      wallet
    })
  });

  const data = await res.json();

  if (data.error) {
    alert(data.error);
  } else {
    alert("Withdraw request sent!");
    updateBalance(0);
    checkWithdraw(0);
  }
}

// ================= UI =================
function updateBalance(amount) {
  document.getElementById("balance").innerText = amount + " TT";
}

function checkWithdraw(amount) {
  const btn = document.getElementById("withdrawBtn");
  if (amount >= 1000) {
    btn.style.display = "block";
  } else {
    btn.style.display = "none";
  }
}

// ================= START =================
init();
