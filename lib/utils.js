const { format } = require("date-fns");
const { findUniqueFile } = require("../services/fileServices");

async function getUniqueFileName(
  userId,
  originalName,
  folderId = null,
  cb,
  itemId = null,
) {
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

    if (itemId && existingFile && existingFile.id === itemId) {
      return candidateName;
    }

    if (!existingFile) {
      return candidateName;
    }

    candidateName = `${baseName} (${counter})${extension}`;
    counter++;
  }
}

function formatDate(string) {
  return format(new Date(string), "yyyy/MM/dd HH:mm");
}

const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
};

module.exports = { getUniqueFileName, formatDate, formatSize };
