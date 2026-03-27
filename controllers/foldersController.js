const { body, validationResult, matchedData } = require("express-validator");
const {
  createNewFolder,
  findFoldersByUserId,
  deleteFolderById,
  findUniqueFolder,
  findFolderContents,
  renameFolderById,
} = require("../services/folderServices");
const { findFilesByUserId } = require("../services/fileServices");
const { getUniqueFileName } = require("../lib/utils");

const validateFolderName = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Folder name is required")
    .isLength({ min: 1, max: 100 })
    .withMessage("Folder name must be between 1 and 100 characters")
    .matches(/^[^<>:"/\\|?*\x00-\x1F]+$/)
    .withMessage("Folder name contains invalid characters"),
];

const postNewFolder = [
  validateFolderName,
  async (req, res, next) => {
    const newFolderErrors = validationResult(req);
    if (!newFolderErrors.isEmpty()) {
      const folders = await findFoldersByUserId(req.user.id);
      const files = await findFilesByUserId(req.user.id);
      return res.status(422).render("index", {
        title: "Dashboard",
        newFolderErrors: newFolderErrors.array(),
        openDialog: "createFolder",
        files,
        folders,
      });
    }
    try {
      let folderId = null;
      const userId = req.user.id;
      if (req.params.folderId) {
        folderId = Number(req.params.folderId);
      }

      const data = matchedData(req);
      const folderName = await getUniqueFileName(
        userId,
        data.name,
        folderId,
        findUniqueFolder,
      );
      await createNewFolder(userId, folderName, folderId);
      if (folderId) {
        return res.redirect(`/folders/${folderId}`);
      }
      return res.redirect("/");
    } catch (error) {
      console.error(error);
      return res.render("status", {
        title: "An error occurred!",
        status: { code: error.html_code, msg: error.message },
        redirect: { path: "/", msg: "Go to home page" },
      });
    }
  },
];

const deleteFolder = async (req, res, next) => {
  const { folderId } = req.params;
  try {
    if (folderId) {
      await deleteFolderById(Number(folderId));
      return res.sendStatus(204);
    }
  } catch (error) {
    console.error(error);
  }

  next();
};

const getFolderContents = async (req, res, next) => {
  const { folderId } = req.params;
  try {
    const folder = await findFolderContents(Number(folderId));
    if (!folder) {
      return res.render("status", {
        title: "An error occurred!",
        status: { code: 404, msg: "Folder does not exist" },
        redirect: { path: "/", msg: "Go to home page" },
      });
    }
    return res.render("index", {
      title: "Dashboard",
      files: folder.files,
      folders: folder.children,
      currentFolder: folderId,
    });
  } catch (error) {
    console.error(error);
    return res.render("status", {
      title: "An error occurred!",
      status: { code: error.html_code, msg: error.message },
      redirect: { path: "/", msg: "Go to home page" },
    });
  }
};

const renameFolder = [
  validateFolderName,
  async (req, res, next) => {
    const renameFolderErrors = validationResult(req);
    if (!renameFolderErrors.isEmpty()) {
      return res.status(400).json({ errors: renameFolderErrors.array() });
    }
    try {
      const userId = req.user.id;
      let currentFolder = null;
      const folderId = Number(req.params.folderId);
      const { name } = matchedData(req);
      if (req.body.currentFolder) {
        currentFolder = Number(req.body.currentFolder);
      }
      const validName = await getUniqueFileName(
        userId,
        name,
        currentFolder ?? null,
        findUniqueFolder,
        folderId,
      );
      const folder = await renameFolderById(folderId, validName);
      return res.json({ success: true, folder });
    } catch (error) {
      console.error(error);
      return res.render("status", {
        title: "An error occurred!",
        status: {
          code: error.http_code,
          msg: error.message,
        },
        redirect: { path: "/", msg: "Go to home page" },
      });
    }
  },
];

module.exports = {
  postNewFolder,
  deleteFolder,
  getFolderContents,
  renameFolder,
};
