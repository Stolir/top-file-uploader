const { prisma } = require("../lib/prisma");

// finds all folders for a user at certain level of nesting using parentId
const findFoldersByUserId = async (userId, parentId = null) => {
  return await prisma.folder.findMany({
    where: {
      userId,
      parentId,
    },
  });
};

const createNewFolder = async (userId, folderName, parentId = null) => {
  try {
    return await prisma.folder.create({
      data: {
        userId,
        name: folderName,
        parentId,
      },
    });
  } catch (error) {
    if (error.code === "P2002") {
      // Prisma unique constraint failed
      throw new Error("Folder with this name already exists in this location");
    }
    throw error;
  }
};

module.exports = { findFoldersByUserId, createNewFolder };
