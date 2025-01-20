import * as fs from 'node:fs/promises';
import path from 'node:path';
import { UPLOADS_DIR } from '../constants/index.js';

export const saveFileToUploadsDir = async (file) => {
  const fileNewPath = path.join(UPLOADS_DIR, file.filename);
  await fs.rename(file.path, fileNewPath);
  return `/${file.filename}`;
};
