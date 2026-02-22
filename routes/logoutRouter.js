const { Router } = require("express");
const { postLogout } = require("../controllers/logoutController");

const logoutRouter = Router();

logoutRouter.get("/", postLogout);

module.exports = logoutRouter;
