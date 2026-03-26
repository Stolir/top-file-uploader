const { Router } = require("express");
const upload = require("../middleware/upload");
const { postNewFile, deleteFile } = require("../controllers/filesController");

const fileRouter = Router();

fileRouter.post("/", upload.single("file"), postNewFile);
fileRouter.delete("/:fileId", deleteFile);

module.exports = fileRouter;
