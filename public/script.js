async function openBox(id) {
  const res = await fetch("/api/open-box", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: "demo_user"
    })
  });

  const data = await res.json();

  if (data.error) {
    alert(data.error);
    return;
  }

  document.getElementById("result").innerText =
    "🎉 You got: " + data.reward;
}
