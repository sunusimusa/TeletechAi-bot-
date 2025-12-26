let balance = 0;
let energy = 100;

const balanceEl = document.getElementById("balance");
const energyEl = document.getElementById("energy");
const tapBtn = document.getElementById("tapBtn");

function updateUI() {
  balanceEl.innerText = balance + " TT";
  energyEl.innerText = energy;
}

tapBtn.onclick = () => {
  if (energy <= 0) return;

  energy--;
  balance++;

  tapBtn.style.transform = "scale(0.9)";
  setTimeout(() => tapBtn.style.transform = "scale(1)", 100);

  updateUI();
};

function copyLink() {
  const link = window.location.origin + "?ref=12345";
  navigator.clipboard.writeText(link);
  alert("Invite link copied!");
}

updateUI();
