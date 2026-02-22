const { body, validationResult } = require("express-validator");
const { userIsLoggedIn } = require("../lib/authHelpers");

const validateUserLogin = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .bail()
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .bail()
    .isLength({ min: 8, max: 128 })
    .withMessage("Password must be between 8 and 128 characters"),
];

const getLoginPage = (req, res) => {
  if (userIsLoggedIn(req)) {
    return res.render("status", {
      title: "An error occurred!",
      status: { code: 409, msg: "You are already logged in" },
      redirect: { path: "/", msg: "Go to home page" },
    });
  }

  const data = {};
  const errors = req.session.messages ?? [];
  delete req.session.messages;

  if (req.session.username) {
    data.username = req.session.username;
    delete req.session.username;
  }
  res.render("login", { title: "Login", data, errors, validationErrors: {} });
};

const postValidateLogin = [
  validateUserLogin,
  (req, res, next) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      const errors = req.session.messages ?? [];
      delete req.session.messages;

      const errorsMap = {};
      validationErrors
        .array()
        .forEach((error) => (errorsMap[error.path] = error.msg));

      return res.status(422).render("login", {
        title: "Log In",
        data: req.body,
        errors,
        validationErrors: errorsMap,
      });
    }
    next();
  },
];

const postLoginSuccess = (req, res) => {
  if (req.redirectTo) {
    res.redirect(req.redirectTo);
  } else {
    res.redirect("/");
  }
};

module.exports = {
  getLoginPage,
  postValidateLogin,
  postLoginSuccess,
};
