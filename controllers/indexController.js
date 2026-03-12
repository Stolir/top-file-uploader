const { userIsLoggedIn } = require("../lib/authHelpers");

const getHomePage = (req, res) => {
  if (userIsLoggedIn) {
    return res.render("dashboard", { title: "Dashboard" });
  }
  res.render("index", { title: "Home" });
};

module.exports = { getHomePage };
