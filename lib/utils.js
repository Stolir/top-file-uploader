const { findUniqueFile } = require("../services/fileServices");

async function getUniqueFileName(userId, originalName, folderId = null, cb) {
  const lastDotIndex = originalName.lastIndexOf(".");

  let baseName = originalName;
  let extension = "";

  if (lastDotIndex !== -1) {
    baseName = originalName.slice(0, lastDotIndex);
    extension = originalName.slice(lastDotIndex); // includes the dot, e.g. ".pdf"
  }

  let candidateName = originalName;
  let counter = 1;

  while (true) {
    const existingFile = await cb(userId, candidateName, folderId);

    if (!existingFile) {
      return candidateName;
    }

    candidateName = `${baseName} (${counter})${extension}`;
    counter++;
  }
}

module.exports = { getUniqueFileName };
