import * as fs from 'node:fs/promises';
import path from 'node:path';
import { UPLOADS_DIR } from '../constants/index.js';

export const deleteFileFromUploadsDir = async (fileUrl) => {
  const filePath = path.join(UPLOADS_DIR, fileUrl.split('/').pop());
  if (filePath) {
    await fs.unlink(filePath);
  }
};
