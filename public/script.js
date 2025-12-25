/***********************
 * TELETECH AI – TAP DEMO
 * Frontend only (demo)
 ***********************/

// ====== CONFIG ======
const STORAGE_KEY = "teletech_balance";
const TAP_REWARD = 1;

// ====== ELEMENTS ======
const tapBtn = document.getElementById("tapBtn");
const balanceEl = document.getElementById("balance");
const withdrawBtn = document.getElementById("withdrawBtn");

// ====== LOAD BALANCE ======
let balance = Number(localStorage.getItem(STORAGE_KEY)) || 0;
updateBalance(balance);

// ====== TAP EVENT ======
tapBtn.addEventListener("click", () => {
  // anti-spam (very light)
  tapBtn.classList.add("active");
  setTimeout(() => tapBtn.classList.remove("active"), 80);

  // vibration (mobile)
  if (navigator.vibrate) {
    navigator.vibrate(20);
  }

  // add balance
  balance += TAP_REWARD;
  localStorage.setItem(STORAGE_KEY, balance);
  updateBalance(balance);

  // floating +1 effect
  floatPlusOne();
});

// ====== UPDATE UI ======
function updateBalance(amount) {
  balanceEl.innerText = amount + " TT";

  // show withdraw button at 1000+
  if (amount >= 1000) {
    withdrawBtn.style.display = "block";
  } else {
    withdrawBtn.style.display = "none";
  }
}

// ====== FLOATING +1 ======
function floatPlusOne() {
  const plus = document.createElement("div");
  plus.innerText = "+1";
  plus.className = "float";

  const rect = tapBtn.getBoundingClientRect();
  plus.style.left = rect.left + rect.width / 2 + "px";
  plus.style.top = rect.top + "px";

  document.body.appendChild(plus);
  setTimeout(() => plus.remove(), 800);
}

// ====== WITHDRAW (DEMO) ======
withdrawBtn.addEventListener("click", () => {
  alert(
    "🚫 Withdraw locked\n\n" +
    "This is DEMO mode.\n" +
    "Complete tasks & wait for launch."
  );
});
// ===== TASK SYSTEM (DEMO) =====
const TASK_KEY = "teletech_tasks";
let tasks = JSON.parse(localStorage.getItem(TASK_KEY)) || {};

function completeTask(task) {
  if (tasks[task]) {
    alert("✅ Task already completed");
    return;
  }

  let reward = 0;

  if (task === "join") reward = 50;
  if (task === "invite") reward = 100;
  if (task === "daily") reward = 20;

  balance += reward;
  localStorage.setItem(STORAGE_KEY, balance);

  tasks[task] = true;
  localStorage.setItem(TASK_KEY, JSON.stringify(tasks));

  updateBalance(balance);
  alert(`🎉 Task completed! +${reward} TT`);

  disableCompletedTasks();
}

function disableCompletedTasks() {
  document.querySelectorAll(".taskBtn").forEach(btn => {
    if (btn.innerText.toLowerCase().includes("join") && tasks.join) btn.disabled = true;
    if (btn.innerText.toLowerCase().includes("invite") && tasks.invite) btn.disabled = true;
    if (btn.innerText.toLowerCase().includes("daily") && tasks.daily) btn.disabled = true;
  });
}

// run on load
disableCompletedTasks();
