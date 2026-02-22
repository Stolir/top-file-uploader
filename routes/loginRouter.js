const { Router } = require("express");
const {
  getLoginPage,
  validateUserLogin,
  postLoginSuccess,
  postValidateLogin,
} = require("../controllers/loginController");
const passport = require("passport");

const loginRouter = Router();

loginRouter.get("/", getLoginPage);
loginRouter.post(
  "/",
  postValidateLogin,
  (req, res, next) => {
    req.redirectTo = req.session.redirectUrl ?? null;
    delete req.session.redirectUrl;
    next();
  },
  passport.authenticate("local", {
    failureRedirect: "login",
    failureMessage: true,
  }),
  postLoginSuccess,
);

module.exports = loginRouter;
