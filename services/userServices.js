// find by unique field
const findUserByUsername = (username) => {
  return prisma.user.findUnique({ where: { username } });
};

const findUserById = (userId) => {
  return prisma.user.findUnique({ where: { userId } });
};

module.exports = { findUserByUsername, findUserById };
