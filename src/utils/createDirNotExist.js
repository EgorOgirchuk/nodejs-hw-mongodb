import * as fs from 'node:fs/promises';

export const createDirNotExist = async (dirPath) => {
  try {
    await fs.access(dirPath);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.mkdir(dirPath);
    }
  }
};
