async function openBox() {
  const res = await fetch("/api/open-box", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: "demo_user" })
  });

  const data = await res.json();

  if (data.error) {
    alert("⚡ No energy!");
    return;
  }

  document.getElementById("result").innerText =
    "🎁 You got: " + data.reward;

  document.getElementById("energy").innerText =
    "Energy: " + data.energy;
}

let energy = 100;

function openBox(box) {
  if (box.classList.contains("opened")) return;

  if (energy < 10) {
    alert("❌ No energy!");
    return;
  }

  energy -= 10;
  document.getElementById("energy").innerText = "Energy: " + energy;

  const rewards = [
    { type: "coin", value: 100 },
    { type: "coin", value: 200 },
    { type: "token", value: 1 },
    { type: "nothing", value: 0 }
  ];

  const reward = rewards[Math.floor(Math.random() * rewards.length)];

  box.classList.add("opened");

  if (reward.type === "nothing") {
    box.innerHTML = "😢";
  } else if (reward.type === "coin") {
    box.innerHTML = `💰 ${reward.value}`;
  } else {
    box.innerHTML = `🪙 TOKEN`;
  }
}
