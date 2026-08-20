let player = JSON.parse(localStorage.getItem("neonPlayer")) || {
  name: "GUEST",
  level: 1,
  xp: 0
};

function showPage(page) {
  document.querySelectorAll(".page").forEach(section => {
    section.classList.remove("active");
  });

  const target = document.getElementById(page);

  if (target) {
    target.classList.add("active");
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }
}

function filterGames(type) {
  document.querySelectorAll(".game-card").forEach(card => {
    if (type === "all" || card.dataset.type === type) {
      card.style.display = "";
    } else {
      card.style.display = "none";
    }
  });
}

function playGame(game) {
  alert(
    game +
    " selected!\n\nGame launching system will be connected here."
  );

  addXP(100);
}

function login() {
  const name = document.getElementById("loginName").value.trim();
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  const message = document.getElementById("loginMessage");

  if (!name || !email || !password) {
    message.textContent = "Please fill in every field.";
    return;
  }

  player.name = name;
  player.level = 1;
  player.xp = 0;

  localStorage.setItem(
    "neonPlayer",
    JSON.stringify(player)
  );

  updateProfile();

  message.textContent =
    "Login successful! Welcome, " + name + ".";

  setTimeout(() => {
    showPage("profile");
  }, 700);
}

function addXP(amount) {
  player.xp += amount;

  const newLevel =
    Math.floor(player.xp / 1000) + 1;

  if (newLevel > player.level) {
    player.level = newLevel;

    alert(
      "LEVEL UP!\n\nYou reached Level " +
      player.level + "!"
    );
  }

  localStorage.setItem(
    "neonPlayer",
    JSON.stringify(player)
  );

  updateProfile();
}

function updateProfile() {
  const username =
    document.getElementById("username");

  const level =
    document.getElementById("level");

  const xp =
    document.getElementById("xp");

  if (username) username.textContent = player.name;
  if (level) level.textContent = player.level;
  if (xp) xp.textContent = player.xp;
}

updateProfile();
