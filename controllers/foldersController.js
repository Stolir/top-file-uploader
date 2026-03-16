const { body, validationResult, matchedData } = require("express-validator");
const {
  createNewFolder,
  findFoldersByUserId,
} = require("../services/folderServices");
const { findFilesByUserId } = require("../services/fileServices");

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

function getUserFolders(req, res) {}

const postNewFolder = [
  validateFolderName,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const folders = await findFoldersByUserId(req.user.id);
      const files = await findFilesByUserId(req.user.id);
      return res.status(422).render("index", {
        title: "Dashboard",
        errors: errors.array(),
        openDialog: true,
        files,
        folders,
      });
    }
    const data = matchedData(req);
    await createNewFolder(req.user.id, data.name);
    console.log(`Created folder ${data.name}`);
    res.redirect("/");
  },
];

module.exports = {
  getUserFolders,
  postNewFolder,
};
