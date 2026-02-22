const { body, validationResult, matchedData } = require("express-validator");
const {
  findUserByUsername,
  createUser,
  findUserByEmail,
} = require("../services/userServices");
const { generateHashedPassword } = require("../lib/passwordUtils");

const validateUser = [
  body("first_name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .bail()
    .isLength({ max: 50 })
    .withMessage("Name must be under 50 characters")
    .bail()
    .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/)
    .withMessage("Name contains invalid characters"),
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .bail()
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters")
    .bail()
    .matches(/^[a-zA-Z0-9_-]{3,30}$/)
    .withMessage("Usernames can only contain letters, numbers, _, and -")
    .bail()
    .custom(async (username) => {
      const user = await findUserByUsername(username);
      if (user) {
        throw new Error("Username is not available");
      }
    }),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("Invalid email address")
    .bail()
    .normalizeEmail()
    .custom(async (email) => {
      const user = await findUserByEmail(email);
      if (user) {
        throw new Error("Email not available");
      }
    }),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .bail()
    .isLength({ min: 8, max: 128 })
    .withMessage("Password must be between 8-128 characters"),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),
];

const getSignupPage = (req, res) => {
  res.render("signup", { title: "Sign Up", data: {}, errors: {} });
};

const postSignupRequest = [
  validateUser,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorsMap = {};
      errors.array().forEach((error) => (errorsMap[error.path] = error.msg));
      res.render("signup", {
        title: "Sign Up",
        data: req.body,
        errors: errorsMap,
      });
    }
    const data = matchedData(req);
    const password_hash = generateHashedPassword(data.password);
    const user = await createUser({
      first_name: data.first_name,
      username: data.username,
      password_hash,
      email: data.email,
    });
    req.session.username = user.username;
    res.redirect("/login");
  },
];

module.exports = { getSignupPage, postSignupRequest };
