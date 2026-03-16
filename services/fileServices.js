const { prisma } = require("../lib/prisma");

const findFilesByUserId = async (userId, folderId = null) => {
  return await prisma.file.findMany({
    where: {
      userId,
      folderId,
    },
  });
};

module.exports = { findFilesByUserId };
