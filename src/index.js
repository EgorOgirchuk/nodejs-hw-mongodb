import { initMongoConnection } from './db/initMongoConnection.js';
import { setupServer } from './server.js';
import { createDirNotExist } from './utils/createDirNotExist.js';
import { TEMP_UPLOAD_DIR, UPLOADS_DIR } from './constants/index.js';

const bootstrap = async () => {
  await createDirNotExist(TEMP_UPLOAD_DIR);
  await createDirNotExist(UPLOADS_DIR);

  await initMongoConnection();
  setupServer();
};

bootstrap();
