const { Router } = require("express");
const {
  postNewFolder,
  deleteFolder,
} = require("../controllers/foldersController");
const { isOwner } = require("../middleware/authMiddleware");

const foldersRouter = Router();

// foldersRouter.get("/", getUserFolders);
foldersRouter.post("/", postNewFolder);
foldersRouter.delete("/:folderId", isOwner, deleteFolder);

module.exports = foldersRouter;
