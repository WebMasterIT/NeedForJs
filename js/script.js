const MAX_ENEMY = 7;
const HEIGHT_ELEM = 100;

const score = document.querySelector(".score"),
  start = document.querySelector(".start"),
  restart = document.querySelector(".restart"),
  gameArea = document.querySelector(".gameArea"),
  exit = document.querySelector(".exit"),
  topScore = document.querySelector(".top-score"),
  car = document.createElement("div");
car.classList.add("car");

const countSection = Math.floor(document.documentElement.clientHeight / HEIGHT_ELEM);

gameArea.style.height = countSection * HEIGHT_ELEM;

restart.classList.add('hide');
exit.classList.add('hide');
topScore.classList.add('hide');

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
exit.addEventListener("click", restartGame);
document.addEventListener("keydown", startRun);
document.addEventListener("keyup", stopRun);

function restartGame() {
  location.href=location.href;
}

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowRight: false,
  ArrowLeft: false,
};

const setting = {
  start: false,
  score: 0,
  speed: 0,
  traffic: 0,
  level: 0
};

let level = setting.level;

function getQuantityElements(heightElement) {
  return (gameArea.offsetHeight / heightElement) + 1  ;
}


topScore.textContent = localStorage.getItem('nfjs_score', setting.score) ? localStorage.getItem('nfjs_score', setting.score) : 0;

const addLocalStorage = () => {
  if (topScore.textContent < setting.score) {
    localStorage.setItem('nfjs_score', setting.score);
    topScore.textContent = 'TOP SCORE: ' + setting.score;
  }
}

function startGame() {
  const target = event.target;
  if (target === start) return;

  switch(target.id) {
    case 'easy':
      setting.speed = 3;
      setting.traffic = 4;
      break;
    case 'medium':
      setting.speed = 5;
      setting.traffic = 3;
      break;
    case 'hard':
      setting.speed = 6;
      setting.traffic = 2;
      break;
  } 

  start.classList.add("hide");
  restart.classList.add("hide");
  exit.classList.add("hide");
  topScore.classList.remove('hide');
  gameArea.innerHTML = '';
  
  for (let i = 0; i < getQuantityElements(HEIGHT_ELEM); i++) {
    const line = document.createElement("div"); 
    line.classList.add("line");
    line.style.top = (i * HEIGHT_ELEM) + "px";
    line.style.height = (HEIGHT_ELEM / 2) + 'px'; 
    line.y = i * HEIGHT_ELEM;
    gameArea.append(line);
  }

  for (let i = 0; i < getQuantityElements(HEIGHT_ELEM * setting.traffic); i++) {
    const enemy = document.createElement("div");
    const randomEnemy = Math.floor(Math.random() * MAX_ENEMY + 1);
    enemy.classList.add("enemy");
    periodEnemy = -HEIGHT_ELEM * setting.traffic * (i + 1);
    enemy.y  = periodEnemy < 100 ? -100 * setting.traffic * (i + 1) : periodEnemy;
    enemy.style.top = enemy.y + "px";
    enemy.style.background =
      `transparent url("../image/enemy${randomEnemy}.png") center / cover no-repeat`;
    gameArea.appendChild(enemy);
    enemy.style.left =
      Math.floor(Math.random() * (gameArea.offsetWidth - enemy.offsetWidth)) + "px";
  }

  setting.score = 0;
  setting.start = true;
  gameArea.append(car);
  gameArea.append(audio);
  car.style.left = gameArea.offsetWidth / 2 - car.offsetWidth / 2;
  car.style.top = 'auto';
  car.style.bottom = '10px';
  setting.x = car.offsetLeft;
  setting.y = car.offsetTop;
  requestAnimationFrame(playGame);
}

function playGame() {

  setting.level = Math.floor(setting.score / 1000);

  if (setting.level !== level) {
    level = setting.level;
    setting.speed +=level; 
  }

  if (setting.start) {
    setting.score += setting.speed;
    score.innerHTML = 'SCORE<br>' + setting.score;
    moveRoad();
    moveEnemy();
    if (keys.ArrowLeft && setting.x > 0) {
      setting.x -= setting.speed;
    }
    if (keys.ArrowRight && setting.x < (gameArea.offsetWidth - 55)) {
      setting.x += setting.speed;
    }

    if (keys.ArrowDown && setting.y < (gameArea.offsetHeight - 55)) {
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

    if (line.y >= gameArea.offsetHeight) {
      line.y = -HEIGHT_ELEM;
    }
  });
}

function moveEnemy() {
  let enemy = document.querySelectorAll(".enemy");
  enemy.forEach(function (item) {
    let carRect = car.getBoundingClientRect();
    let emnemyRect = item.getBoundingClientRect();

    if (carRect.top <= emnemyRect.bottom && carRect.right >= emnemyRect.left &&
        carRect.left + 30   <= emnemyRect.right  && carRect.bottom >= emnemyRect.top) {
            setting.start = false;
            audio.remove();
            gameArea.append(crash);
            restart.classList.remove('hide');
            restart.style.top += '400px';
            exit.classList.remove('hide');
            addLocalStorage();
    }
    item.y += setting.speed / 0.5;
    item.style.top = item.y + 100 + "px";

    if (item.y >= gameArea.offsetHeight) {
        item.y = -HEIGHT_ELEM * setting.traffic;
        item.style.left =
        Math.floor(Math.random() * (gameArea.offsetWidth - item.offsetWidth)) + "px";
    }
  });
}
