const { findFileById } = require("../services/fileServices");
const { findFolderById } = require("../services/folderServices");

module.exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.redirectUrl = req.originalUrl;
  res.redirect("/login");
};

module.exports.isOwner = async (req, res, next) => {
  const userId = req.user.id;
  const { folderId, fileId } = req.params;

  try {
    if (folderId) {
      const folder = await findFolderById(Number(folderId));
      if (!folder) {
        return res.status(404).render("status", {
          title: "Folder not found",
          status: { code: 404, msg: "Folder does not exist" },
          redirect: { path: "/", msg: "Return to dashboard" },
        });
      }
      if (folder.userId === userId) {
        return next();
      }
    }
    if (fileId) {
      const file = await findFileById(Number(fileId));
      if (!file) {
        return res.status(404).render("status", {
          title: "File not found",
          status: { code: 404, msg: "File does not exist" },
          redirect: { path: "/", msg: "Return to dashboard" },
        });
      }
      if (file.userId === userId) {
        return next();
      }
    }
    return res.status(403).render("status", {
      title: "Not authorized",
      status: {
        code: 403,
        msg: "You do not permission to perform this action",
      },
      redirect: {
        path: "/",
        msg: "Return to dashboard",
      },
    });
  } catch (error) {
    next(error);
  }
};
