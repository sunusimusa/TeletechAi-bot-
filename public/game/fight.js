let playerHP = 100;
let enemyHP = 100;
let fighting = false;

function updateBars() {
  document.getElementById("playerHP").style.width = playerHP + "%";
  document.getElementById("enemyHP").style.width = enemyHP + "%";
}

function attack() {
  if (fighting) return;
  fighting = true;

  // Player attacks
  let playerDamage = Math.floor(Math.random() * 15) + 5;
  enemyHP -= playerDamage;
  if (enemyHP < 0) enemyHP = 0;

  updateBars();

  if (enemyHP <= 0) {
    alert("🎉 YOU WIN!");
    resetGame();
    return;
  }

  // Enemy attacks
  setTimeout(() => {
    let enemyDamage = Math.floor(Math.random() * 12) + 5;
    playerHP -= enemyDamage;
    if (playerHP < 0) playerHP = 0;

    updateBars();

    if (playerHP <= 0) {
      alert("💀 YOU LOSE!");
      resetGame();
    }

    fighting = false;
  }, 700);
}

function resetGame() {
  playerHP = 100;
  enemyHP = 100;
  updateBars();
}
