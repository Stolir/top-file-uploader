require("dotenv").config({
  path: `.env.${process.env.NODE_ENV || "development"}`,
});

require("./config/passport");
// General require
const fs = require("fs");

// Require express related
const express = require("express");
const path = require("node:path");

// Require auth related
const passport = require("passport");
const expressSession = require("express-session");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const { prisma } = require("./lib/prisma");

// Require Routes

// Define app related
const app = express();
const PORT = process.env.PORT || 3000;

// Set express settings
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Use middleware
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
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // One day
    },
  }),
);

// Custom middleware

// Use routes

// Run app
