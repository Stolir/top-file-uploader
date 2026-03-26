const cloudinary = require("../config/cloudinary");
const uploadToCloudinary = require("../lib/uploadToCloudinary");
const { getUniqueFileName } = require("../lib/utils");
const {
  createNewFile,
  findFileById,
  deleteFileById,
  findUniqueFile,
} = require("../services/fileServices");

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
      folderId = req.params.folderId;
    }

    const userId = req.user.id;
    console.log(req.file);
    const fileName = await getUniqueFileName(
      userId,
      req.file.originalname,
      folderId,
      findUniqueFile,
    );

    const result = await uploadToCloudinary(req.file.buffer, "user_uploads");
    console.log(result);
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
      return res.redirect(`/folder/${folderId}`);
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

module.exports = { postNewFile, deleteFile };
