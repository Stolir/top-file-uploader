const { Router } = require("express");
const {
  postNewFolder,
  deleteFolder,
  getFolderContents,
  renameFolder,
} = require("../controllers/foldersController");
const { isOwner } = require("../middleware/authMiddleware");

const foldersRouter = Router();

// foldersRouter.get("/", getUserFolders);
foldersRouter.get("/:folderId", isOwner, getFolderContents);
foldersRouter.post("{/:folderId}", postNewFolder);
foldersRouter.delete("/:folderId", isOwner, deleteFolder);
foldersRouter.patch("/:folderId", isOwner, renameFolder);

module.exports = foldersRouter;
