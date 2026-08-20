/* =========================================
   NEON NEXUS
   COMPLETE WEBSITE + PLAYABLE NEON ARENA
========================================= */


/* =========================================
   PLAYER SYSTEM
========================================= */

const defaultPlayer = {
  loggedIn: false,
  name: "GUEST",
  email: "",
  level: 1,
  xp: 0,
  matches: 0,
  wins: 0
};

let player =
  JSON.parse(
    localStorage.getItem("neonNexusPlayer")
  ) || {
    ...defaultPlayer
  };


function savePlayer() {

  localStorage.setItem(
    "neonNexusPlayer",
    JSON.stringify(player)
  );

}


/* =========================================
   NAVIGATION
========================================= */

function showPage(id) {

  document
    .querySelectorAll(".page")
    .forEach(page => {

      page.classList.remove(
        "active"
      );

    });


  const page =
    document.getElementById(id);


  if (!page) return;


  page.classList.add("active");


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });


  updateUI();

}


/* =========================================
   TOAST
========================================= */

let toastTimeout;

function showToast(message) {

  const toast =
    document.getElementById("toast");

  if (!toast) return;


  toast.textContent =
    message;


  toast.classList.add(
    "show"
  );


  clearTimeout(
    toastTimeout
  );


  toastTimeout =
    setTimeout(() => {

      toast.classList.remove(
        "show"
      );

    }, 2300);

}


/* =========================================
   LOGIN
========================================= */

function login(event) {

  event.preventDefault();


  const username =
    document
      .getElementById(
        "loginUsername"
      )
      .value
      .trim();


  const email =
    document
      .getElementById(
        "loginEmail"
      )
      .value
      .trim();


  const password =
    document
      .getElementById(
        "loginPassword"
      )
      .value;


  if (
    !username ||
    !email ||
    !password
  ) {

    showToast(
      "Complete all fields."
    );

    return;

  }


  player.loggedIn = true;

  player.name =
    username;

  player.email =
    email;


  savePlayer();

  updateUI();


  showToast(
    "Profile created."
  );


  setTimeout(() => {

    showPage(
      "dashboard"
    );

  }, 500);

}


/* =========================================
   RESET PROFILE
========================================= */

function logout() {

  if (
    !confirm(
      "Reset your local player profile?"
    )
  ) return;


  player = {
    ...defaultPlayer
  };


  savePlayer();

  updateUI();

  showToast(
    "Profile reset."
  );

}


/* =========================================
   UI UPDATE
========================================= */

function updateUI() {

  const name =
    player.name ||
    "GUEST";


  const initial =
    name
      .charAt(0)
      .toUpperCase();


  const navName =
    document.getElementById(
      "navName"
    );


  const navAvatar =
    document.getElementById(
      "navAvatar"
    );


  if (navName)
    navName.textContent =
      name.toUpperCase();


  if (navAvatar)
    navAvatar.textContent =
      initial;


  const dashboardGreeting =
    document.getElementById(
      "dashboardGreeting"
    );


  if (
    dashboardGreeting
  ) {

    dashboardGreeting.textContent =
      "WELCOME, " +
      name.toUpperCase();

  }


  const profileName =
    document.getElementById(
      "profileName"
    );


  const profileEmail =
    document.getElementById(
      "profileEmail"
    );


  const profileAvatar =
    document.getElementById(
      "profileAvatar"
    );


  if (profileName)
    profileName.textContent =
      name;


  if (profileEmail)
    profileEmail.textContent =
      player.loggedIn
        ? player.email
        : "Not signed in";


  if (profileAvatar)
    profileAvatar.textContent =
      initial;


  const level =
    Math.floor(
      player.xp / 1000
    ) + 1;


  player.level =
    Math.max(
      1,
      level
    );


  const levelXP =
    player.xp % 1000;


  const percent =
    levelXP / 10;


  const elements = {

    dashboardLevel:
      player.level,

    profileLevel:
      player.level,

    profileXP:
      player.xp,

    matchCount:
      player.matches,

    winCount:
      player.wins,

    xpProgressText:
      levelXP +
      " / 1000 XP",

    currentXP:
      levelXP +
      " XP",

    progressPercent:
      Math.floor(percent) +
      "%"

  };


  Object.keys(elements)
    .forEach(id => {

      const element =
        document.getElementById(id);


      if (element)
        element.textContent =
          elements[id];

    });


  const xpBar =
    document.getElementById(
      "xpBar"
    );


  if (xpBar) {

    xpBar.style.width =
      percent + "%";

  }


  savePlayer();

}


/* =========================================
   GAME NAVIGATION
========================================= */

function launchGame(name) {

  if (
    name ===
    "Neon Arena"
  ) {

    showPage("game");

    resizeGameCanvas();

    return;

  }


  comingSoon(name);

}


function comingSoon(name) {

  showToast(
    name +
    " is coming soon."
  );

}


/* =========================================
   FILTERS
========================================= */

function filterGames(
  category,
  button
) {

  document
    .querySelectorAll(
      ".filter"
    )
    .forEach(item => {

      item.classList.remove(
        "active"
      );

    });


  button.classList.add(
    "active"
  );


  document
    .querySelectorAll(
      ".game-card"
    )
    .forEach(card => {

      if (
        category === "all" ||
        card.dataset.category ===
        category
      ) {

        card.style.display =
          "";

      } else {

        card.style.display =
          "none";

      }

    });

}


/* =========================================
   GAME ENGINE
========================================= */

const game = {

  canvas: null,

  ctx: null,

  running: false,

  animation: null,

  width: 0,

  height: 0,

  score: 0,

  wave: 1,

  hp: 100,

  kills: 0,

  spawnTimer: 0,

  waveTimer: 0,

  lastTime: 0,

  player: null,

  bullets: [],

  enemies: [],

  particles: [],

  stars: [],

  mouse: {

    x: 0,

    y: 0,

    down: false

  },

  keys: {}

};


/* =========================================
   INITIALIZE
========================================= */

function initGame() {

  game.canvas =
    document.getElementById(
      "gameCanvas"
    );


  if (!game.canvas)
    return;


  game.ctx =
    game.canvas.getContext(
      "2d"
    );


  resizeGameCanvas();

  createStars();


  window.addEventListener(
    "resize",
    resizeGameCanvas
  );


  game.canvas.addEventListener(
    "mousemove",
    mouseMove
  );


  game.canvas.addEventListener(
    "mousedown",
    event => {

      if (
        event.button === 0
      )
        game.mouse.down =
          true;

    }
  );


  window.addEventListener(
    "mouseup",
    event => {

      if (
        event.button === 0
      )
        game.mouse.down =
          false;

    }
  );


  game.canvas.addEventListener(
    "touchstart",
    event => {

      event.preventDefault();

      if (
        event.touches.length
      ) {

        game.mouse.down =
          true;

        touchAim(
          event.touches[0]
        );

      }

    },
    {
      passive: false
    }
  );


  game.canvas.addEventListener(
    "touchmove",
    event => {

      event.preventDefault();

      if (
        event.touches.length
      ) {

        touchAim(
          event.touches[0]
        );

      }

    },
    {
      passive: false
    }
  );


  game.canvas.addEventListener(
    "touchend",
    event => {

      event.preventDefault();

      game.mouse.down =
        false;

    },
    {
      passive: false
    }
  );


  window.addEventListener(
    "keydown",
    event => {

      const key =
        event.key.toLowerCase();


      game.keys[key] =
        true;


      if (
        [
          "w",
          "a",
          "s",
          "d",
          "arrowup",
          "arrowdown",
          "arrowleft",
          "arrowright",
          " "
        ].includes(key)
      ) {

        event.preventDefault();

      }

    }
  );


  window.addEventListener(
    "keyup",
    event => {

      game.keys[
        event.key.toLowerCase()
      ] = false;

    }
  );


  setupMobile();

}


/* =========================================
   RESIZE
========================================= */

function resizeGameCanvas() {

  if (
    !game.canvas
  )
    return;


  const rect =
    game.canvas.getBoundingClientRect();


  const ratio =
    window.devicePixelRatio ||
    1;


  game.width =
    rect.width;

  game.height =
    rect.height;


  game.canvas.width =
    rect.width * ratio;

  game.canvas.height =
    rect.height * ratio;


  game.ctx.setTransform(
    ratio,
    0,
    0,
    ratio,
    0,
    0
  );


  if (
    game.player
  ) {

    game.player.x =
      Math.min(
        game.player.x,
        game.width - 20
      );


    game.player.y =
      Math.min(
        game.player.y,
        game.height - 20
      );

  }

}


/* =========================================
   STARS
========================================= */

function createStars() {

  game.stars = [];


  for (
    let i = 0;
    i < 100;
    i++
  ) {

    game.stars.push({

      x:
        Math.random() *
        game.width,

      y:
        Math.random() *
        game.height,

      size:
        Math.random() *
        2,

      speed:
        Math.random() *
        .4 +
        .1,

      alpha:
        Math.random()

    });

  }

}


/* =========================================
   START
========================================= */

function startGame() {

  if (
    !game.canvas
  ) {

    initGame();

  }


  resizeGameCanvas();


  game.running =
    false;


  game.score =
    0;

  game.wave =
    1;

  game.hp =
    100;

  game.kills =
    0;

  game.spawnTimer =
    .5;

  game.waveTimer =
    0;


  game.bullets =
    [];

  game.enemies =
    [];

  game.particles =
    [];


  game.player = {

    x:
      game.width / 2,

    y:
      game.height / 2,

    radius:
      14,

    speed:
      280,

    angle:
      0,

    cooldown:
      0,

    invulnerable:
      0

  };


  document
    .getElementById(
      "gameStartScreen"
    )
    .classList.add(
      "hidden"
    );


  document
    .getElementById(
      "gameOverScreen"
    )
    .classList.add(
      "hidden"
    );


  updateHUD();


  game.running =
    true;


  game.lastTime =
    performance.now();


  game.animation =
    requestAnimationFrame(
      gameLoop
    );

}


/* =========================================
   LOOP
========================================= */

function gameLoop(time) {

  if (
    !game.running
  )
    return;


  const delta =
    Math.min(
      (time -
        game.lastTime) /
        1000,
      .05
    );


  game.lastTime =
    time;


  update(delta);

  draw();


  game.animation =
    requestAnimationFrame(
      gameLoop
    );

}


/* =========================================
   UPDATE
========================================= */

function update(delta) {

  movePlayer(delta);

  updateBullets(delta);

  updateEnemies(delta);

  updateParticles(delta);

  spawnEnemies(delta);


  game.waveTimer +=
    delta;


  if (
    game.waveTimer >=
    20
  ) {

    game.wave++;

    game.waveTimer =
      0;

    showToast(
      "WAVE " +
      game.wave
    );

  }


  game.player.cooldown -=
    delta;

  game.player.invulnerable -=
    delta;


  if (
    game.mouse.down &&
    game.player.cooldown <=
    0
  ) {

    shoot();

  }


  if (
    game.hp <=
    0
  ) {

    endGame();

  }


  updateHUD();

}


/* =========================================
   PLAYER
========================================= */

function movePlayer(delta) {

  let dx = 0;

  let dy = 0;


  if (
    game.keys.w ||
    game.keys.arrowup
  )
    dy--;


  if (
    game.keys.s ||
    game.keys.arrowdown
  )
    dy++;


  if (
    game.keys.a ||
    game.keys.arrowleft
  )
    dx--;


  if (
    game.keys.d ||
    game.keys.arrowright
  )
    dx++;


  const length =
    Math.hypot(
      dx,
      dy
    );


  if (
    length
  ) {

    dx /= length;

    dy /= length;


    game.player.x +=
      dx *
      game.player.speed *
      delta;


    game.player.y +=
      dy *
      game.player.speed *
      delta;

  }


  const margin =
    20;


  game.player.x =
    Math.max(
      margin,
      Math.min(
        game.width -
        margin,
        game.player.x
      )
    );


  game.player.y =
    Math.max(
      margin,
      Math.min(
        game.height -
        margin,
        game.player.y
      )
    );


  game.player.angle =
    Math.atan2(
      game.mouse.y -
        game.player.y,
      game.mouse.x -
        game.player.x
    );

}


/* =========================================
   SHOOT
========================================= */

function shoot() {

  if (
    game.player.cooldown >
    0
  )
    return;


  const angle =
    game.player.angle;


  game.bullets.push({

    x:
      game.player.x +
      Math.cos(angle) *
      20,

    y:
      game.player.y +
      Math.sin(angle) *
      20,

    vx:
      Math.cos(angle) *
      720,

    vy:
      Math.sin(angle) *
      720,

    radius:
      4,

    life:
      1

  });


  game.player.cooldown =
    .12;


  particles(
    game.player.x +
      Math.cos(angle) *
      20,

    game.player.y +
      Math.sin(angle) *
      20,

    4,

    "#35e7ff"
  );

}


/* =========================================
   BULLETS
========================================= */

function updateBullets(delta) {

  for (
    let i =
      game.bullets.length -
      1;

    i >= 0;

    i--
  ) {

    const b =
      game.bullets[i];


    b.x +=
      b.vx *
      delta;

    b.y +=
      b.vy *
      delta;

    b.life -=
      delta;


    if (
      b.life <= 0 ||
      b.x < -30 ||
      b.x >
        game.width +
        30 ||
      b.y < -30 ||
      b.y >
        game.height +
        30
    ) {

      game.bullets.splice(
        i,
        1
      );

      continue;

    }


    for (
      let j =
        game.enemies.length -
        1;

      j >= 0;

      j--
    ) {

      const e =
        game.enemies[j];


      const distance =
        Math.hypot(
          b.x - e.x,
          b.y - e.y
        );


      if (
        distance <
        b.radius +
        e.radius
      ) {

        e.hp--;


        particles(
          b.x,
          b.y,
          5,
          "#ff4fb8"
        );


        game.bullets.splice(
          i,
          1
        );


        if (
          e.hp <=
          0
        ) {

          destroyEnemy(j);

        }


        break;

      }

    }

  }

}


/* =========================================
   ENEMY SPAWNING
========================================= */

function spawnEnemies(delta) {

  game.spawnTimer -=
    delta;


  if (
    game.spawnTimer >
    0
  )
    return;


  const amount =
    Math.min(
      1 +
      Math.floor(
        game.wave /
        3
      ),
      4
    );


  for (
    let i = 0;
    i < amount;
    i++
  ) {

    spawnEnemy();

  }


  game.spawnTimer =
    Math.max(
      .3,
      1.25 -
      game.wave *
      .04
    );

}


/* =========================================
   SPAWN ONE
========================================= */

function spawnEnemy() {

  const side =
    Math.floor(
      Math.random() *
      4
    );


  let x;

  let y;


  if (
    side ===
    0
  ) {

    x =
      Math.random() *
      game.width;

    y =
      -30;

  } else if (
    side ===
    1
  ) {

    x =
      game.width +
      30;

    y =
      Math.random() *
      game.height;

  } else if (
    side ===
    2
  ) {

    x =
      Math.random() *
      game.width;

    y =
      game.height +
      30;

  } else {

    x =
      -30;

    y =
      Math.random() *
      game.height;

  }


  const roll =
    Math.random();


  let enemy;


  if (
    roll < .15
  ) {

    const hp =
      4 +
      Math.floor(
        game.wave /
        3
      );


    enemy = {

      x,
      y,

      radius:
        22,

      speed:
        50 +
        game.wave *
        2,

      hp,

      maxHp:
        hp,

      damage:
        18,

      value:
        100,

      type:
        "tank"

    };

  } else if (
    roll < .35
  ) {

    enemy = {

      x,
      y,

      radius:
        9,

      speed:
        135 +
        game.wave *
        3,

      hp:
        1,

      maxHp:
        1,

      damage:
        8,

      value:
        40,

      type:
        "fast"

    };

  } else {

    const hp =
      2 +
      Math.floor(
        game.wave /
        5
      );


    enemy = {

      x,
      y,

      radius:
        15,

      speed:
        75 +
        game.wave *
        2,

      hp,

      maxHp:
        hp,

      damage:
        12,

      value:
        60,

      type:
        "normal"

    };

  }


  game.enemies.push(
    enemy
  );

}


/* =========================================
   ENEMY UPDATE
========================================= */

function updateEnemies(delta) {

  for (
    let i =
      game.enemies.length -
      1;

    i >= 0;

    i--
  ) {

    const e =
      game.enemies[i];


    const dx =
      game.player.x -
      e.x;


    const dy =
      game.player.y -
      e.y;


    const distance =
      Math.hypot(
        dx,
        dy
      );


    if (
      distance >
      0
    ) {

      e.x +=
        dx /
        distance *
        e.speed *
        delta;


      e.y +=
        dy /
        distance *
        e.speed *
        delta;

    }


    if (
      distance <
      e.radius +
      game.player.radius
    ) {

      if (
        game.player
          .invulnerable <=
        0
      ) {

        game.hp -=
          e.damage;


        game.player
          .invulnerable =
          .5;


        particles(
          game.player.x,
          game.player.y,
          15,
          "#ff4f76"
        );

      }


      game.enemies.splice(
        i,
        1
      );

    }

  }

}


/* =========================================
   DESTROY
========================================= */

function destroyEnemy(index) {

  const e =
    game.enemies[index];


  game.score +=
    e.value;


  game.kills++;


  particles(
    e.x,
    e.y,
    e.type === "tank"
      ? 25
      : 12,

    e.type === "tank"
      ? "#ff9d4d"
      : "#ff4fb8"
  );


  game.enemies.splice(
    index,
    1
  );

}


/* =========================================
   PARTICLES
========================================= */

function particles(
  x,
  y,
  count,
  color
) {

  for (
    let i = 0;
    i < count;
    i++
  ) {

    const angle =
      Math.random() *
      Math.PI *
      2;


    const speed =
      Math.random() *
      150 +
      40;


    game.particles.push({

      x,
      y,

      vx:
        Math.cos(angle) *
        speed,

      vy:
        Math.sin(angle) *
        speed,

      size:
        Math.random() *
        3 +
        1,

      life:
        Math.random() *
        .5 +
        .3,

      color

    });

  }

}


/* =========================================
   PARTICLE UPDATE
========================================= */

function updateParticles(delta) {

  for (
    let i =
      game.particles.length -
      1;

    i >= 0;

    i--
  ) {

    const p =
      game.particles[i];


    p.x +=
      p.vx *
      delta;

    p.y +=
      p.vy *
      delta;


    p.vx *=
      .96;

    p.vy *=
      .96;


    p.life -=
      delta;


    if (
      p.life <=
      0
    ) {

      game.particles.splice(
        i,
        1
      );

    }

  }

}


/* =========================================
   DRAW
========================================= */

function draw() {

  const ctx =
    game.ctx;


  ctx.clearRect(
    0,
    0,
    game.width,
    game.height
  );


  drawBackground();

  drawStars();

  drawGrid();

  drawBullets();

  drawEnemies();

  drawParticles();

  drawPlayer();

}


/* =========================================
   BACKGROUND
========================================= */

function drawBackground() {

  const ctx =
    game.ctx;


  const gradient =
    ctx.createRadialGradient(
      game.width / 2,
      game.height / 2,
      0,
      game.width / 2,
      game.height / 2,
      Math.max(
        game.width,
        game.height
      )
    );


  gradient.addColorStop(
    0,
    "#0a1c2d"
  );


  gradient.addColorStop(
    1,
    "#02050c"
  );


  ctx.fillStyle =
    gradient;


  ctx.fillRect(
    0,
    0,
    game.width,
    game.height
  );

}


/* =========================================
   GRID
========================================= */

function drawGrid() {

  const ctx =
    game.ctx;


  ctx.save();


  ctx.strokeStyle =
    "#35e7ff0b";


  ctx.lineWidth =
    1;


  const spacing =
    50;


  for (
    let x = 0;
    x < game.width;
    x += spacing
  ) {

    ctx.beginPath();

    ctx.moveTo(
      x,
      0
    );

    ctx.lineTo(
      x,
      game.height
    );

    ctx.stroke();

  }


  for (
    let y = 0;
    y < game.height;
    y += spacing
  ) {

    ctx.beginPath();

    ctx.moveTo(
      0,
      y
    );

    ctx.lineTo(
      game.width,
      y
    );

    ctx.stroke();

  }


  ctx.restore();

}


/* =========================================
   STARS
========================================= */

function drawStars() {

  const ctx =
    game.ctx;


  for (
    const star of game.stars
  ) {

    star.y +=
      star.speed;


    if (
      star.y >
      game.height
    )
      star.y =
        0;


    ctx.globalAlpha =
      star.alpha;


    ctx.fillStyle =
      "#8fefff";


    ctx.fillRect(
      star.x,
      star.y,
      star.size,
      star.size
    );

  }


  ctx.globalAlpha =
    1;

}


/* =========================================
   PLAYER DRAW
========================================= */

function drawPlayer() {

  const ctx =
    game.ctx;

  const p =
    game.player;


  if (!p)
    return;


  ctx.save();


  ctx.translate(
    p.x,
    p.y
  );


  ctx.rotate(
    p.angle
  );


  ctx.shadowBlur =
    25;


  ctx.shadowColor =
    "#35e7ff";


  ctx.beginPath();


  ctx.moveTo(
    20,
    0
  );


  ctx.lineTo(
    -12,
    -11
  );


  ctx.lineTo(
    -7,
    0
  );


  ctx.lineTo(
    -12,
    11
  );


  ctx.closePath();


  ctx.fillStyle =
    "#35e7ff";


  ctx.fill();


  ctx.shadowBlur =
    0;


  ctx.beginPath();


  ctx.arc(
    0,
    0,
    5,
    0,
    Math.PI * 2
  );


  ctx.fillStyle =
    "#fff";


  ctx.fill();


  ctx.restore();


  /* HP ring */

  ctx.save();


  ctx.strokeStyle =
    "#ff4f76";


  ctx.lineWidth =
    3;


  ctx.beginPath();


  ctx.arc(
    p.x,
    p.y,
    24,
    -Math.PI / 2,
    -Math.PI / 2 +
    Math.PI *
    2 *
    Math.max(
      0,
      game.hp / 100
    )
  );


  ctx.stroke();


  ctx.restore();

}


/* =========================================
   BULLETS DRAW
========================================= */

function drawBullets() {

  const ctx =
    game.ctx;


  for (
    const b of game.bullets
  ) {

    ctx.save();


    ctx.shadowBlur =
      15;


    ctx.shadowColor =
      "#35e7ff";


    ctx.fillStyle =
      "#fff";


    ctx.beginPath();


    ctx.arc(
      b.x,
      b.y,
      b.radius,
      0,
      Math.PI * 2
    );


    ctx.fill();


    ctx.restore();

  }

}


/* =========================================
   ENEMIES DRAW
========================================= */

function drawEnemies() {

  const ctx =
    game.ctx;


  for (
    const e of game.enemies
  ) {

    let color;


    if (
      e.type ===
      "tank"
    ) {

      color =
        "#ff9d4d";

    } else if (
      e.type ===
      "fast"
    ) {

      color =
        "#9a5cff";

    } else {

      color =
        "#ff4fb8";

    }


    ctx.save();


    ctx.shadowBlur =
      20;


    ctx.shadowColor =
      color;


    ctx.strokeStyle =
      color;


    ctx.fillStyle =
      "#080d18";


    ctx.lineWidth =
      2;


    ctx.beginPath();


    ctx.arc(
      e.x,
      e.y,
      e.radius,
      0,
      Math.PI * 2
    );


    ctx.fill();

    ctx.stroke();


    ctx.shadowBlur =
      0;


    ctx.beginPath();


    ctx.arc(
      e.x,
      e.y,
      e.radius *
      .35,
      0,
      Math.PI * 2
    );


    ctx.fillStyle =
      color;


    ctx.fill();


    if (
      e.hp <
      e.maxHp
    ) {

      const width =
        e.radius *
        2;


      const percent =
        e.hp /
        e.maxHp;


      ctx.fillStyle =
        "#172235";


      ctx.fillRect(
        e.x -
        e.radius,
        e.y -
        e.radius -
        8,
        width,
        3
      );


      ctx.fillStyle =
        color;


      ctx.fillRect(
        e.x -
        e.radius,
        e.y -
        e.radius -
        8,
        width *
        percent,
        3
      );

    }


    ctx.restore();

  }

}


/* =========================================
   PARTICLES DRAW
========================================= */

function drawParticles() {

  const ctx =
    game.ctx;


  for (
    const p of game.particles
  ) {

    ctx.save();


    ctx.globalAlpha =
      Math.max(
        p.life,
        0
      );


    ctx.fillStyle =
      p.color;


    ctx.shadowBlur =
      10;


    ctx.shadowColor =
      p.color;


    ctx.beginPath();


    ctx.arc(
      p.x,
      p.y,
      p.size,
      0,
      Math.PI * 2
    );


    ctx.fill();


    ctx.restore();

  }

}


/* =========================================
   MOUSE
========================================= */

function mouseMove(event) {

  const rect =
    game.canvas.getBoundingClientRect();


  game.mouse.x =
    event.clientX -
    rect.left;


  game.mouse.y =
    event.clientY -
    rect.top;

}


/* =========================================
   TOUCH AIM
========================================= */

function touchAim(touch) {

  const rect =
    game.canvas.getBoundingClientRect();


  game.mouse.x =
    touch.clientX -
    rect.left;


  game.mouse.y =
    touch.clientY -
    rect.top;

}


/* =========================================
   MOBILE
========================================= */

function setupMobile() {

  document
    .querySelectorAll(
      ".control-btn"
    )
    .forEach(button => {

      const key =
        button.dataset.key;


      function press(event) {

        event.preventDefault();

        game.keys[key] =
          true;

      }


      function release(event) {

        event.preventDefault();

        game.keys[key] =
          false;

      }


      button.addEventListener(
        "touchstart",
        press,
        {
          passive: false
        }
      );


      button.addEventListener(
        "touchend",
        release,
        {
          passive: false
        }
      );


      button.addEventListener(
        "touchcancel",
        release,
        {
          passive: false
        }
      );


      button.addEventListener(
        "mousedown",
        press
      );


      button.addEventListener(
        "mouseup",
        release
      );


      button.addEventListener(
        "mouseleave",
        release
      );

    });


  const shoot =
    document.getElementById(
      "mobileShoot"
    );


  if (!shoot)
    return;


  shoot.addEventListener(
    "touchstart",
    event => {

      event.preventDefault();

      game.mouse.down =
        true;

    },
    {
      passive: false
    }
  );


  shoot.addEventListener(
    "touchend",
    event => {

      event.preventDefault();

      game.mouse.down =
        false;

    },
    {
      passive: false
    }
  );


  shoot.addEventListener(
    "mousedown",
    () => {

      game.mouse.down =
        true;

    }
  );


  shoot.addEventListener(
    "mouseup",
    () => {

      game.mouse.down =
        false;

    }
  );

}


/* =========================================
   HUD
========================================= */

function updateHUD() {

  const score =
    document.getElementById(
      "gameScore"
    );


  const wave =
    document.getElementById(
      "gameWave"
    );


  const hp =
    document.getElementById(
      "gameHP"
    );


  if (score)
    score.textContent =
      game.score;


  if (wave)
    wave.textContent =
      game.wave;


  if (hp)
    hp.textContent =
      Math.max(
        0,
        Math.floor(
          game.hp
        )
      );

}


/* =========================================
   GAME OVER
========================================= */

function endGame() {

  if (
    !game.running
  )
    return;


  game.running =
    false;


  if (
    game.animation
  ) {

    cancelAnimationFrame(
      game.animation
    );

  }


  document.getElementById(
    "finalScore"
  ).textContent =
    game.score;


  document.getElementById(
    "gameOverMessage"
  ).textContent =
    "Wave " +
    game.wave +
    " • " +
    game.kills +
    " enemies destroyed";


  document
    .getElementById(
      "gameOverScreen"
    )
    .classList.remove(
      "hidden"
    );


  /* XP */

  const reward =
    Math.max(
      50,
      Math.floor(
        game.score /
        2
      )
    );


  player.matches++;


  player.xp +=
    reward;


  if (
    game.score >=
    500
  ) {

    player.wins++;

  }


  player.level =
    Math.floor(
      player.xp /
      1000
    ) + 1;


  savePlayer();

  updateUI();


  showToast(
    "+" +
    reward +
    " XP"
  );

}


/* =========================================
   EXIT
========================================= */

function exitGame() {

  game.running =
    false;


  if (
    game.animation
  ) {

    cancelAnimationFrame(
      game.animation
    );

  }


  game.mouse.down =
    false;


  document
    .getElementById(
      "gameOverScreen"
    )
    .classList.add(
      "hidden"
    );


  document
    .getElementById(
      "gameStartScreen"
    )
    .classList.remove(
      "hidden"
    );


  showPage(
    "games"
  );

}


/* =========================================
   STARTUP
========================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    updateUI();

    initGame();

  }
);
