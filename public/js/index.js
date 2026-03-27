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

// Context menu functionality
// Delete Folder
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

// Rename File or Folder
const renameButtons = document.querySelectorAll(".contextMenu .rename");

renameButtons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const selected = selectedFile || selectedFolder;
    console.log(selected);
    const input = selected.querySelector("input");

    console.log(input);
    startRename(input);
  });
});

// Delete File
const fileDeleteBtn = fileMenu.querySelector(".delete");

fileDeleteBtn.addEventListener("click", async () => {
  if (!selectedFile) {
    return;
  }

  const fileId = selectedFile.dataset.id;
  const parent = selectedFile.parentNode; // keep parent reference
  const nextSibling = selectedFile.nextSibling; // keep next sibling to restore in original position
  try {
    selectedFile.remove();
    const res = await fetch(`/files/${fileId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      throw new Error(`Delete failed: ${res.status}`);
    }
  } catch (error) {
    console.error(error);
    alert("Failed to delete file" + " " + error.message);
    if (nextSibling) {
      parent.insertBefore(selectedFile, nextSibling);
    } else {
      parent.appendChild(selectedFile);
    }
  }
});

const fileNameInputs = document.querySelectorAll(".folder input, .file input");

// Scroll asset name on hover for long names
fileNameInputs.forEach((el) => {
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

fileNameInputs.forEach((el) => {
  el.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
  });

  el.addEventListener("dblclick", (e) => {
    e.preventDefault();
    e.stopPropagation();
    startRename(el);
  });
});

function startRename(input) {
  const originalName = input.value;
  const lastDot = originalName.lastIndexOf(".");
  const ext = lastDot !== -1 ? originalName.slice(lastDot) : "";
  input.removeAttribute("readonly");
  input.classList.add("renaming");
  input.focus();
  input.select();

  input._keydownHandler = (e) => onKeydown(e, input, originalName, ext);
  input._blurHandler = () => onBlur(input, originalName);

  input.addEventListener("keydown", input._keydownHandler);
  input.addEventListener("blur", input._blurHandler);
}

function onKeydown(e, input, originalName = null, ext) {
  if (e.key === "Enter") {
    e.target.removeEventListener("blur", input._blurHandler);
    finishRename(input, originalName, ext);
  }
  if (e.key === "Escape") {
    e.target.removeEventListener("blur", input._blurHandler);
    cancelRename(input, originalName);
  }
}

function onBlur(input, originalName) {
  cancelRename(input, originalName);
}

function cancelRename(input, originalName) {
  input.setAttribute("readonly", true);
  input.classList.remove("renaming");
  input.value = originalName;
  input.removeEventListener("keydown", input._keydownHandler);
  input.removeEventListener("blur", input._blurHandler);
}

async function finishRename(input, originalName, ext) {
  const newName = input.value.trim();
  const { id, type } = input.dataset;
  input.setAttribute("readonly", true);
  input.classList.remove("renaming");
  const result = await renameItem(newName, id, type, ext);
  if (!result.success) {
    input.value = originalName;
  }
  input.value = type === "folder" ? result.folder.name : result.file.name;
}

async function renameItem(newName, id, type, ext) {
  const endPoint = type === "folder" ? `/folders/${id}` : `/files/${id}`;
  try {
    const res = await fetch(endPoint, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newName + ext,
        currentFolder: dashboard.dataset.currentFolderId ?? null,
      }),
    });

    if (!res.ok) {
      throw new Error(`Rename failed: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error(error);
    alert(error);
    return false;
  }
}
