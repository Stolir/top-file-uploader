const { prisma } = require("../lib/prisma");

// finds all folders for a user at certain level of nesting using parentId

const findFolderById = async (folderId) => {
  return await prisma.folder.findUnique({
    where: {
      id: folderId,
    },
  });
};

const findFoldersByUserId = async (userId, parentId = null) => {
  return await prisma.folder.findMany({
    where: {
      userId,
      parentId,
    },
  });
};

// using fields in the @@unqiue restraint
const findUniqueFolder = async (userId, folderName, parentId) => {
  return await prisma.folder.findFirst({
    where: {
      userId,
      name: folderName,
      parentId,
    },
  });
};

const createNewFolder = async (userId, folderName, parentId) => {
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

const deleteFolderById = async (folderId) => {
  try {
    return await prisma.folder.delete({
      where: {
        id: folderId,
      },
    });
  } catch (error) {
    console.error("Error deleting folder: ", error);
  }
};

const findFolderContents = async (folderId) => {
  try {
    return await prisma.folder.findUnique({
      where: { id: folderId },
      include: { children: true, files: true },
    });
  } catch (error) {
    console.error("Error getting folder", error);
  }
};

const renameFolderById = async (folderId, newName) => {
  return await prisma.folder.update({
    where: {
      id: folderId,
    },
    data: {
      name: newName,
    },
  });
};

module.exports = {
  findFolderById,
  findFoldersByUserId,
  findUniqueFolder,
  createNewFolder,
  deleteFolderById,
  findFolderContents,
  renameFolderById,
};
