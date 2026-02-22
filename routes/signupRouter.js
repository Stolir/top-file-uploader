const { Router } = require("express");
const {
  getSignupPage,
  postSignupRequest,
} = require("../controllers/signupController");

const signupRouter = Router();

signupRouter.get("/", getSignupPage);
signupRouter.post("/", postSignupRequest);

module.exports = signupRouter;
