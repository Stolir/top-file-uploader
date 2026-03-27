const { validationResult, matchedData, body } = require("express-validator");
const cloudinary = require("../config/cloudinary");
const uploadToCloudinary = require("../lib/uploadToCloudinary");
const {
  getUniqueFileName,
  convertDate,
  formatDate,
  formatSize,
} = require("../lib/utils");
const {
  createNewFile,
  findFileById,
  deleteFileById,
  findUniqueFile,
  renameFileById,
} = require("../services/fileServices");

// only used when renaming
const validateFileName = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("File name is required")
    .isLength({ min: 1, max: 100 })
    .withMessage("File name must be between 1 and 100 characters")
    .matches(/^[^<>:"/\\|?*\x00-\x1F]+$/)
    .withMessage("File name contains invalid characters"),
];

async function postNewFile(req, res, next) {
  try {
    let folderId = null;

    if (!req.file) {
      return res.render("status", {
        title: "An error occurred!",
        status: { code: 400, msg: "No file was uploaded" },
        redirect: { path: "/", msg: "Go to home page" },
      });
    }

    if (req.params.folderId) {
      folderId = Number(req.params.folderId);
    }

    const userId = req.user.id;
    const fileName = await getUniqueFileName(
      userId,
      req.file.originalname,
      folderId,
      findUniqueFile,
    );

    const result = await uploadToCloudinary(req.file.buffer, "user_uploads");
    await createNewFile({
      name: fileName,
      url: result.secure_url,
      publicId: result.public_id,
      mimeType: req.file.mimetype,
      size: req.file.size,
      folderId,
      userId,
    });

    if (folderId) {
      return res.redirect(`/folders/${folderId}`);
    }

    return res.redirect("/");
  } catch (error) {
    console.error(error);
    return res.render("status", {
      title: "An error occurred!",
      status: { code: error.http_code, msg: error.message },
      redirect: { path: "/", msg: "Go to home page" },
    });
  }
}

async function deleteFile(req, res, next) {
  try {
    const fileId = req.params.fileId;
    const file = await findFileById(Number(fileId));

    // check if file exists
    if (!file) {
      return res.render("status", {
        title: "An error occurred!",
        status: { code: 404, msg: "File not found" },
        redirect: { path: "/", msg: "Go to home page" },
      });
    }
    // make sure user owns requested file
    if (file.userId !== req.user.id) {
      return res.render("status", {
        title: "An error occurred!",
        status: {
          code: 403,
          msg: "You are not authorized to perform this action",
        },
        redirect: { path: "/", msg: "Go to home page" },
      });
    }
    await cloudinary.uploader.destroy(file.publicId);
    await deleteFileById(file.id);
    res.json({ success: true, message: "File deleted" });
  } catch (error) {
    console.error(error);
    return res.render("status", {
      title: "An error occurred!",
      status: {
        code: 500,
        msg: "Delete failed",
      },
      redirect: { path: "/", msg: "Go to home page" },
    });
  }
}

const renameFile = [
  validateFileName,
  async (req, res, next) => {
    const renameFileErrors = validationResult(req);
    if (!renameFileErrors.isEmpty()) {
      return res.status(400).json({ errors: renameFileErrors.array() });
    }
    try {
      let currentFolder = null;
      const userId = req.user.id;

      const fileId = Number(req.params.fileId);
      const { name } = matchedData(req);
      if (req.body.currentFolder) {
        currentFolder = Number(req.body.currentFolder);
      }
      const validName = await getUniqueFileName(
        userId,
        name,
        currentFolder,
        findUniqueFile,
        fileId,
      );
      const file = await renameFileById(fileId, validName);
      return res.json({ success: true, file });
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

async function getFilePage(req, res, next) {
  const fileId = Number(req.params.fileId);
  try {
    const file = await findFileById(fileId);
    if (!file) {
      return res.render("status", {
        title: "An error occurred!",
        status: {
          code: 404,
          msg: "File not found.",
        },
        redirect: { path: "/", msg: "Go to home page" },
      });
    }
    const formattedDate = formatDate(file.createdAt);
    const formattedSize = formatSize(file.size);
    return res.render("viewFile", {
      title: file.name,
      file,
      formattedDate,
      formattedSize,
    });
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
}

module.exports = { postNewFile, deleteFile, renameFile, getFilePage };
