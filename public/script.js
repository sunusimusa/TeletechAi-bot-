// ==========================
// CREATE OR GET USER ID
// ==========================
let userId = localStorage.getItem("uid");

if (!userId) {
  userId = Math.floor(Math.random() * 1000000);
  localStorage.setItem("uid", userId);
}

// ==========================
// LOAD USER DATA
// ==========================
async function loadUser() {
  const res = await fetch("/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ userId })
  });

  const data = await res.json();
  document.getElementById("balance").innerText = data.balance;
}

// ==========================
// TAP FUNCTION
// ==========================
async function tap() {
  const res = await fetch("/tap", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ userId })
  });

  const data = await res.json();
  document.getElementById("balance").innerText = data.balance;
}

// ==========================
// LOAD ON PAGE OPEN
// ==========================
loadUser();
