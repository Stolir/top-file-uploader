const { prisma } = require("../lib/prisma");

const findFileById = async (fileId) => {
  return await prisma.file.findUnique({
    where: {
      id: fileId,
    },
  });
};

const findFilesByUserId = async (userId, folderId = null) => {
  return await prisma.file.findMany({
    where: {
      userId,
      folderId,
    },
  });
};

module.exports = { findFileById, findFilesByUserId };
