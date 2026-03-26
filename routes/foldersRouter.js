const { Router } = require("express");
const {
  postNewFolder,
  deleteFolder,
  getFolderContents,
} = require("../controllers/foldersController");
const { isOwner } = require("../middleware/authMiddleware");

const foldersRouter = Router();

// foldersRouter.get("/", getUserFolders);
foldersRouter.get("/:folderId", getFolderContents);
foldersRouter.post("{/:folderId}", postNewFolder);
foldersRouter.delete("/:folderId", isOwner, deleteFolder);

module.exports = foldersRouter;
