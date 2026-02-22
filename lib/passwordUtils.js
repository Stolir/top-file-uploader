const bcrypt = require("bcryptjs");

function generateHashedPassword(password) {
  return bcrypt.hashSync(password, 10);
}

function validatePassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}

module.exports = {
  generateHashedPassword,
  validatePassword,
};
