module.exports.userIsLoggedIn = (req) => {
  if (req.isAuthenticated()) {
    return true;
  }
  return false;
};
