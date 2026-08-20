/* =========================================
   NEON NEXUS
   Frontend Game Hub
========================================= */


/* =========================================
   PLAYER DATA
========================================= */

const defaultPlayer = {
  loggedIn: false,
  name: "GUEST",
  email: "",
  level: 1,
  xp: 0,
  matches: 0,
  wins: 0,
  favorites: []
};

let player =
  JSON.parse(localStorage.getItem("neonNexusPlayer"))
  || defaultPlayer;


/* =========================================
   SAVE DATA
========================================= */

function savePlayer() {

  localStorage.setItem(
    "neonNexusPlayer",
    JSON.stringify(player)
  );

}


/* =========================================
   PAGE NAVIGATION
========================================= */

function showPage(pageName) {

  document
    .querySelectorAll(".page")
    .forEach(page => {
      page.classList.remove("active");
    });

  const page =
    document.getElementById(pageName);

  if (!page) return;

  page.classList.add("active");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  updateUI();

}


/* =========================================
   MOBILE MENU
========================================= */

function toggleMenu() {

  const menu =
    document.getElementById("mobileMenu");

  menu.classList.toggle("open");

}


/* =========================================
   LOGIN
========================================= */

function login(event) {

  event.preventDefault();

  const username =
    document
      .getElementById("loginUsername")
      .value
      .trim();

  const email =
    document
      .getElementById("loginEmail")
      .value
      .trim();

  const password =
    document
      .getElementById("loginPassword")
      .value;

  if (!username || !email || !password) {

    showToast(
      "Please complete all fields."
    );

    return;

  }

  player.loggedIn = true;

  player.name = username;

  player.email = email;

  if (player.level < 1) {
    player.level = 1;
  }

  savePlayer();

  updateUI();

  showToast(
    "Welcome to the Nexus, " +
    username +
    "!"
  );

  setTimeout(() => {

    showPage("dashboard");

  }, 700);

}


/* =========================================
   LOGOUT
========================================= */

function logout() {

  player = {
    ...defaultPlayer
  };

  savePlayer();

  updateUI();

  showToast("Signed out successfully.");

  setTimeout(() => {

    showPage("home");

  }, 500);

}


/* =========================================
   XP SYSTEM
========================================= */

function addXP(amount) {

  if (!player.loggedIn) {

    showToast(
      "Sign in to save your XP."
    );

    return;

  }

  const oldLevel =
    player.level;

  player.xp += amount;

  player.level =
    Math.floor(
      player.xp / 1000
    ) + 1;

  savePlayer();

  updateUI();

  if (player.level > oldLevel) {

    showToast(
      "⚡ LEVEL UP! You reached Level " +
      player.level
    );

  } else {

    showToast(
      "+" + amount + " XP earned!"
    );

  }

}


/* =========================================
   PLAY GAME
========================================= */

function playGame(gameName) {

  if (!player.loggedIn) {

    showToast(
      "Sign in before playing."
    );

    setTimeout(() => {

      showPage("login");

    }, 700);

    return;

  }

  player.matches++;

  const xp =
    Math.floor(
      Math.random() * 300
    ) + 100;

  addXP(xp);

  addActivity(
    gameName,
    xp
  );

}


/* =========================================
   ACTIVITY
========================================= */

function addActivity(
  gameName,
  xp
) {

  const list =
    document.getElementById(
      "activityList"
    );

  if (!list) return;

  const activity =
    document.createElement("div");

  activity.className =
    "activity";

  activity.innerHTML = `
    <span>⚡</span>

    <div>
      <b>${gameName}</b>
      <small>+${xp} XP earned just now</small>
    </div>
  `;

  list.prepend(activity);

}


/* =========================================
   FAVORITES
========================================= */

function favoriteGame(button) {

  button.classList.toggle("liked");

  button.textContent =
    button.classList.contains("liked")
      ? "♥"
      : "♡";

  showToast(
    button.classList.contains("liked")
      ? "Added to favorites."
      : "Removed from favorites."
  );

}


/* =========================================
   GAME FILTER
========================================= */

function filterGames(
  category,
  clickedButton
) {

  document
    .querySelectorAll(".filter")
    .forEach(button => {

      button.classList.remove(
        "active"
      );

    });

  clickedButton.classList.add(
    "active"
  );

  document
    .querySelectorAll(".library-card")
    .forEach(card => {

      const cardCategory =
        card.dataset.category;

      if (
        category === "all" ||
        cardCategory === category
      ) {

        card.style.display = "";

      } else {

        card.style.display =
          "none";

      }

    });

}


/* =========================================
   SETTINGS
========================================= */

function toggleSetting(button) {

  button.classList.toggle(
    "active"
  );

}


/* =========================================
   TOAST
========================================= */

let toastTimer;

function showToast(message) {

  const toast =
    document.getElementById(
      "toast"
    );

  toast.textContent =
    message;

  toast.classList.add(
    "show"
  );

  clearTimeout(toastTimer);

  toastTimer =
    setTimeout(() => {

      toast.classList.remove(
        "show"
      );

    }, 2500);

}


/* =========================================
   UPDATE UI
========================================= */

function updateUI() {

  const name =
    player.name || "GUEST";

  const initial =
    name.charAt(0).toUpperCase();


  /* NAV */

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


  /* DASHBOARD */

  const greeting =
    document.getElementById(
      "dashboardGreeting"
    );

  const level =
    document.getElementById(
      "dashboardLevel"
    );

  const currentXP =
    document.getElementById(
      "currentXP"
    );

  const progressText =
    document.getElementById(
      "xpProgressText"
    );

  const xpBar =
    document.getElementById(
      "xpBar"
    );

  const progressPercent =
    document.getElementById(
      "progressPercent"
    );

  const matches =
    document.getElementById(
      "matchCount"
    );

  const wins =
    document.getElementById(
      "winCount"
    );


  if (greeting) {

    greeting.textContent =
      "WELCOME, " +
      name.toUpperCase();

  }


  if (level) {

    level.textContent =
      player.level;

  }


  const currentLevelXP =
    player.xp %
    1000;

  const percent =
    Math.min(
      currentLevelXP / 10,
      100
    );


  if (currentXP) {

    currentXP.textContent =
      currentLevelXP +
      " XP";

  }


  if (progressText) {

    progressText.textContent =
      currentLevelXP +
      " / 1000 XP";

  }


  if (xpBar) {

    xpBar.style.width =
      percent + "%";

  }


  if (progressPercent) {

    progressPercent.textContent =
      Math.floor(percent) +
      "%";

  }


  if (matches) {

    matches.textContent =
      player.matches;

  }


  if (wins) {

    wins.textContent =
      player.wins;

  }


  /* PROFILE */

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

  const profileLevel =
    document.getElementById(
      "profileLevel"
    );

  const profileXP =
    document.getElementById(
      "profileXP"
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

  if (profileLevel)
    profileLevel.textContent =
      player.level;

  if (profileXP)
    profileXP.textContent =
      player.xp;

}


/* =========================================
   STARTUP
========================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    updateUI();

  }
);
