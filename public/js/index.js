const fileMenu = document.getElementById("fileMenu");
const dashboardMenu = document.getElementById("dashboardMenu");

document.addEventListener("contextmenu", function (e) {
  e.preventDefault(); // stop default menu

  // Hide both first
  fileMenu.style.display = "none";
  dashboardMenu.style.display = "none";

  const dashboard = document.getElementById("dashboard");

  if (!dashboard || !dashboard.contains(e.target)) {
    console.log(e.target);
    // Not in the dashboard, do nothing
    return;
  }

  let menuToShow;

  if (e.target.closest(".file")) {
    // Right-click on a file
    menuToShow = fileMenu;
  } else {
    // Right-click in empty dashboard space
    menuToShow = dashboardMenu;
  }

  // Position menu
  menuToShow.style.left = e.pageX + "px";
  menuToShow.style.top = e.pageY + "px";
  menuToShow.style.display = "block";

  // Prevent menu from going off-screen
  const rect = menuToShow.getBoundingClientRect();
  if (rect.right > window.innerWidth) {
    menuToShow.style.left = window.innerWidth - rect.width + "px";
  }
  if (rect.bottom > window.innerHeight) {
    menuToShow.style.top = window.innerHeight - rect.height + "px";
  }
});

// Hide menus on any click
document.addEventListener("click", function () {
  fileMenu.style.display = "none";
  dashboardMenu.style.display = "none";
});

// Create new
const createFolder = document.getElementById("createFolder");
const openCreateFolderBtn = document.querySelector("button.openCreateFolder");
const closeCreateFolderBtn = createFolder.querySelector(".close-dialog");

openCreateFolderBtn.addEventListener("click", () => {
  createFolder.show();
});

closeCreateFolderBtn.addEventListener("click", () => {
  createFolder.close();
});
