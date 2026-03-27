require("dotenv").config({
  path: `.env.${process.env.NODE_ENV || "development"}`,
});

require("./config/passport");
// General require
const fs = require("fs");

// Require express related
const express = require("express");
const path = require("node:path");
const expressLayouts = require("express-ejs-layouts");

// Require auth related
const passport = require("passport");
const expressSession = require("express-session");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const { prisma } = require("./lib/prisma");

// Require Routes
const indexRouter = require("./routes/indexRouter");
const signupRouter = require("./routes/signupRouter");
const loginRouter = require("./routes/loginRouter");
const logoutRouter = require("./routes/logoutRouter");
const foldersRouter = require("./routes/foldersRouter");
const fileRouter = require("./routes/fileRouter");
const { isLoggedIn } = require("./middleware/authMiddleware");

// Define app related
const app = express();
const PORT = process.env.PORT || 3000;

// Set express settings
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(expressLayouts);

// Use middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Session middleware
app.use(
  expressSession({
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, // 120,000ms / 1000 = 120s
      dbRecordIdFunction: undefined,
      dbRecordIdIsSessionId: true,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // One day
    },
  }),
);

app.use(passport.session());

// Custom middleware

// set variables used in layout so they are never undefined
app.use((req, res, next) => {
  res.locals.newFolderErrors = [];
  res.locals.openDialog = false;
  next();
});

// development only
// app.use((req, res, next) => {
//   console.log(req.session);
//   console.log(req.user);
//   next();
// });

app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

app.use((req, res, next) => {
  res.locals.currentFolder = req.params.folderId
    ? Number(req.params.folderId)
    : null;
  next();
});

// Use routes
app.use("/", indexRouter);
app.use("/signup", signupRouter);
app.use("/login", loginRouter);
app.use("/logout", logoutRouter);
app.use("/folders", isLoggedIn, foldersRouter);
app.use("/files", isLoggedIn, fileRouter);
// catch all route for 404
app.use((req, res) => {
  return res.status(404).render("status", {
    title: "An error occurred!",
    status: { code: 404, msg: "Page not found." },
    redirect: { path: "/", msg: "Go to home page" },
  });
});
// Run app
app.listen(PORT, (err) => {
  if (err) {
    throw err;
  }
  console.log(`Running on ${PORT}`);
});
