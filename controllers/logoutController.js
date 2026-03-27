const { userIsLoggedIn } = require("../lib/authHelpers");

function postLogout(req, res, next) {
  if (!userIsLoggedIn) {
    res.redirect("/");
  }

  req.logout(function (err) {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.redirect("/");
    });
  });
}

module.exports = { postLogout };
