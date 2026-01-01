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
