let energy = 100;
let freeTries = 3;
let balance = 0;

function openBox(box) {
  if (box.classList.contains("opened")) return;

  // CHECK FREE TRIES
  if (freeTries > 0) {
    freeTries--;
  } else {
    if (energy >= 10) {
      energy -= 10;
    } else if (balance >= 50) {
      balance -= 50;
    } else {
      alert("❌ No Energy or Balance!");
      return;
    }
  }

  updateStats();

  const rewards = [
    { type: "coin", value: 100 },
    { type: "coin", value: 200 },
    { type: "nothing", value: 0 },
  ];

  const reward = rewards[Math.floor(Math.random() * rewards.length)];

  box.classList.add("opened");

  if (reward.type === "coin") {
    box.innerHTML = `💰 ${reward.value}`;
    balance += reward.value;
  } else {
    box.innerHTML = "😢";
  }

  updateStats();

  // ⏳ auto close after 2s
  setTimeout(() => {
    box.classList.remove("opened");
    box.innerHTML = "🎁";
  }, 2000);
}

function updateStats() {
  document.getElementById("energy").innerText = "Energy: " + energy;
  document.getElementById("balance").innerText = "Balance: " + balance;
  document.getElementById("free").innerText = "Free tries: " + freeTries;
}
