const config = {
  type: Phaser.AUTO,
  width: 400,
  height: 600,
  backgroundColor: "#111",
  scene: {
    preload,
    create,
    update
  }
};

const game = new Phaser.Game(config);

let player, enemy, hp = 100;

function preload() {
  this.load.image('player', '/game/assets/player.png');
  this.load.image('enemy', '/game/assets/enemy.png');
}

function create() {
  player = this.add.sprite(200, 450, 'player');
  enemy = this.add.sprite(200, 150, 'enemy');

  this.input.on('pointerdown', () => {
    attack();
  });
}

function attack() {
  hp -= 10;

  if (hp <= 0) {
    alert("🎉 You win! +50 coins");
    rewardUser();
  }
}

function rewardUser() {
  fetch("/game-win", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: window.Telegram.WebApp.initDataUnsafe.user.id,
      reward: 50
    })
  });
}
