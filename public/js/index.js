const dashboard = document.getElementById("dashboard");

const fileMenu = document.getElementById("fileMenu");
const folderMenu = document.getElementById("folderMenu");
const dashboardMenu = document.getElementById("dashboardMenu");

// store elements to be modified by menus
let selectedFolder;
let selectedFile;

document.addEventListener("contextmenu", function (e) {
  e.preventDefault(); // stop default menu

  // Hide both first
  fileMenu.style.display = "none";
  folderMenu.style.display = "none";
  dashboardMenu.style.display = "none";

  const dashboard = document.getElementById("dashboard");

  if (!dashboard || !dashboard.contains(e.target)) {
    // Not in the dashboard, do nothing
    return;
  }

  let menuToShow;

  if (e.target.closest(".file")) {
    // Right-click on a file
    menuToShow = fileMenu;
    selectedFile = e.target.closest(".file");
  } else if (e.target.closest(".folder")) {
    // Right-click on a folder
    menuToShow = folderMenu;
    selectedFolder = e.target.closest(".folder");
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
  folderMenu.style.display = "none";
});

// Create new

// Folder
const createFolder = document.getElementById("createFolder");
const openCreateFolderBtn = document.querySelector("button.openCreateFolder");
const closeCreateFolderBtn = createFolder.querySelector(".close-dialog");

openCreateFolderBtn.addEventListener("click", () => {
  createFolder.show();
});

closeCreateFolderBtn.addEventListener("click", () => {
  createFolder.close();
});

// File
const createFile = document.getElementById("createFile");
const openCreateFileBtn = document.querySelector("button.openCreateFile");
const closeCreateFileBtn = createFile.querySelector(".close-dialog");

openCreateFileBtn.addEventListener("click", () => {
  createFile.show();
});

closeCreateFileBtn.addEventListener("click", () => {
  createFile.close();
});

// Folder context menu functionality
// Delete
const folderDeleteBtn = folderMenu.querySelector(".delete");

folderDeleteBtn.addEventListener("click", async () => {
  if (!selectedFolder) {
    return;
  }
  const folderId = selectedFolder.dataset.id;
  try {
    const res = await fetch(`/folders/${folderId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      throw new Error(`Delete failed: ${res.status}`);
    }
    selectedFolder.remove();
  } catch (error) {
    console.error(error);
    alert("Failed to delete folder:" + " " + error.message);
  }
});

document.querySelectorAll(".folder p, .file p").forEach((el) => {
  let frame;

  el.addEventListener("mouseenter", () => {
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) return;

    let pos = 0;

    const step = () => {
      pos += 0.25;
      el.scrollLeft = pos;

      if (pos < maxScroll) {
        frame = requestAnimationFrame(step);
      }
    };

    step();
  });

  el.addEventListener("mouseleave", () => {
    cancelAnimationFrame(frame);
    el.scrollLeft = 0;
  });
});
