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

const findUniqueFile = async (userId, fileName, folderId) => {
  return await prisma.file.findFirst({
    where: {
      userId,
      name: fileName,
      folderId,
    },
  });
};

const createNewFile = async (fileData) => {
  return await prisma.file.create({
    data: fileData,
  });
};

const deleteFileById = async (fileId) => {
  return await prisma.file.delete({ where: { id: fileId } });
};

const renameFileById = async (fileId, newName) => {
  return await prisma.file.update({
    where: {
      id: fileId,
    },
    data: {
      name: newName,
    },
  });
};

module.exports = {
  findFileById,
  findFilesByUserId,
  createNewFile,
  deleteFileById,
  findUniqueFile,
  renameFileById,
};
