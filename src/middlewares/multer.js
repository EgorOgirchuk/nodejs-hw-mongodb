import multer from 'multer';
import { TEMP_UPLOAD_DIR } from '../constants/index.js';
import createHttpError from 'http-errors';

const storage = multer.diskStorage({
  destination: TEMP_UPLOAD_DIR,
  filename: (req, file, cb) => {
    const uniquePrefix = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniquePrefix}_${file.originalname}`;
    cb(null, filename);
  },
});

const limits = {
  fileSize: 1024 * 1024 * 10,
};

const fileFilter = (req, file, cb) => {
  const extention = file.originalname.split('.').pop();

  if (extention === 'exe') {
    return cb(createHttpError(400, "File type 'exe' is not allowed"));
  }

  cb(null, true);
};

export const uploads = multer({
  storage,
  limits,
  fileFilter,
});
