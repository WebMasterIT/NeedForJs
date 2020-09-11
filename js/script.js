MAX_ENEMY = 7;

const score = document.querySelector(".score"),
  start = document.querySelector(".start"),
  restart = document.querySelector(".restart"),
  gameArea = document.querySelector(".gameArea"),
  car = document.createElement("div");
car.classList.add("car");

restart.classList.add('hide');

const audio = document.createElement('embed');
const crash = document.createElement('embed');

audio.src = 'audio.mp3';
audio.type = 'audio/mp3';
audio.style.cssText = `position: absolute; top: -1000px;`; 


crash.src = 'Авария.mp3';
crash.type = 'audio/mp3';
crash.style.cssText = `position: absolute; top: -1100px;`; 

start.addEventListener("click", startGame);
restart.addEventListener("click", startGame);
document.addEventListener("keydown", startRun);
document.addEventListener("keyup", stopRun);

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowRight: false,
  ArrowLeft: false,
};

const setting = {
  start: false,
  score: 0,
  speed: 3,
  traffic: 5,
};

function getQuantityElements(heightElement) {
  return document.documentElement.clientHeight / heightElement + 1;
}

function startGame() {
  start.classList.add("hide");
  restart.classList.add("hide");
  gameArea.innerHTML = '';
  
  for (let i = 0; i < getQuantityElements(100); i++) {
    const line = document.createElement("div");
    line.classList.add("line");
    line.style.top = i * 100 + "px";
    line.y = i * 100;
    gameArea.appendChild(line);
  }

  for (let i = 0; i < getQuantityElements(100 * setting.traffic); i++) {
    const enemy = document.createElement("div");
    const randomEnemy = Math.floor(Math.random() * MAX_ENEMY + 1);
    enemy.classList.add("enemy");
    enemy.y = -100 * setting.traffic * (i + 1);
    enemy.style.left =
      Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + "px";
    enemy.style.top = enemy.y + "px";
    enemy.style.background =
      `transparent url("/image/enemy${randomEnemy}.png") center / cover no-repeat`;
    gameArea.appendChild(enemy);
  }

  setting.score = 0;
  setting.start = true;
  gameArea.append(car);
  gameArea.append(audio);
  car.style.left = '125px';
  car.style.top = 'auto';
  car.style.bottom = '10px';
  setting.x = car.offsetLeft;
  setting.y = car.offsetTop;
  requestAnimationFrame(playGame);
}

function playGame() {
  if (setting.start) {
    setting.score += setting.speed;
    score.innerHTML = 'SCORE<br>' + setting.score;
    moveRoad();
    moveEnemy();
    if (keys.ArrowLeft && setting.x > 0) {
      setting.x -= setting.speed;
    }
    if (keys.ArrowRight && setting.x < gameArea.offsetWidth - 55) {
      setting.x += setting.speed;
    }

    if (keys.ArrowDown && setting.y < gameArea.offsetHeight - 55) {
      setting.y += setting.speed;
    }

    if (keys.ArrowUp && setting.y > 0) {
      setting.y -= setting.speed;
    }

    car.style.left = setting.x + "px";
    car.style.top = setting.y + "px";
    requestAnimationFrame(playGame);
  }
}

function startRun(event) {
  if (keys.hasOwnProperty(event.key)
  ) {
    event.preventDefault();
    keys[event.key] = true;
  }
}

function stopRun(event) {
  event.preventDefault();
  if (keys.hasOwnProperty(event.key)) {
    keys[event.key] = false;
  }
}

function moveRoad() {
  let lines = document.querySelectorAll(".line");
  lines.forEach(function (line) {
    line.y += setting.speed;
    line.style.top = line.y + "px";

    if (line.y >= document.documentElement.clientHeight) {
      line.y = -100;
    }
  });
}

function moveEnemy() {
  let enemy = document.querySelectorAll(".enemy");
  enemy.forEach(function (item) {
    let carRect = car.getBoundingClientRect();
    let emnemyRect = item.getBoundingClientRect();

    if (carRect.top <= emnemyRect.bottom && carRect.right >= emnemyRect.left &&
        carRect.left <= emnemyRect.right && carRect.bottom >= emnemyRect.top) {
            setting.start = false;
            gameArea.append(crash);
            restart.classList.remove('hide');
            restart.style.top += '400px';

    }
    item.y += setting.speed / 0.5;
    item.style.top = item.y + 100 + "px";
    if (item.y >= document.documentElement.clientHeight) {
      item.y = -100 * setting.traffic;
      item.style.left =
        Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + "px";
    }
  });
}
