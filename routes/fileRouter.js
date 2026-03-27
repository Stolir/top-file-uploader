const { Router } = require("express");
const upload = require("../middleware/upload");
const {
  postNewFile,
  deleteFile,
  renameFile,
} = require("../controllers/filesController");
const { isOwner } = require("../middleware/authMiddleware");

const fileRouter = Router();

fileRouter.post("{/:folderId}", upload.single("file"), postNewFile);
fileRouter.delete("/:fileId", isOwner, deleteFile);
fileRouter.patch("/:fileId", isOwner, renameFile);

module.exports = fileRouter;
