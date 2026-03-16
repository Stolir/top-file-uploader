const { userIsLoggedIn } = require("../lib/authHelpers");
const { findFilesByUserId } = require("../services/fileServices");
const { findFoldersByUserId } = require("../services/folderServices");

const getHomePage = async (req, res) => {
  if (userIsLoggedIn(req)) {
    const folders = await findFoldersByUserId(req.user.id);
    const files = await findFilesByUserId(req.user.id);
    console.log(folders);
    return res.render("index", {
      title: "Dashboard",
      files,
      folders,
    });
  }
  res.render("index", { title: "Home" });
};

module.exports = { getHomePage };
