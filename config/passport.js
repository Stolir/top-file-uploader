const passport = require("passport");
const {
  findUserByUsername,
  findUserById,
} = require("../services/userServices");
const { validatePassword } = require("../lib/passwordUtils");
const LocalStrategy = require("passport-local").Strategy;

const verifyCallback = async (username, password, done) => {
  try {
    const user = findUserByUsername(username);
    if (!user) {
      return done(null, false, { message: "Invalid username or password" });
    }
    const isValid = validatePassword(password, user.password_hash);
    if (isValid) {
      done(null, user);
    } else {
      done(null, false);
    }
  } catch (err) {
    done(err);
  }
};

const strategy = new LocalStrategy(verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (userId, done) => {
  try {
    const user = findUserById(userId);
    if (!user) {
      done(null, false);
    }
    done(null, user);
  } catch (err) {
    done(err);
  }
});
