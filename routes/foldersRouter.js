const { Router } = require("express");
const { postNewFolder } = require("../controllers/foldersController");

const foldersRouter = Router();

// foldersRouter.get("/", getUserFolders);
foldersRouter.post("/", postNewFolder);

module.exports = foldersRouter;
