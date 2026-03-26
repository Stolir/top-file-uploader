const { findFolderById } = require("../services/folderServices");
const { findUserById } = require("../services/userServices");

module.exports.userIsLoggedIn = (req) => {
  if (req.isAuthenticated()) {
    return true;
  }
  return false;
};
