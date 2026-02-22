const { prisma } = require("../lib/prisma");

// find by unique field
const findUserByUsername = async (username) => {
  return await prisma.user.findUnique({ where: { username } });
};

const findUserById = async (userId) => {
  return await prisma.user.findUnique({ where: { id: userId } });
};

const findUserByEmail = async (email) => {
  return await prisma.user.findUnique({ where: { email } });
};

const createUser = async (data) => {
  return await prisma.user.create({ data });
};

module.exports = {
  findUserByUsername,
  findUserById,
  findUserByEmail,
  createUser,
};
