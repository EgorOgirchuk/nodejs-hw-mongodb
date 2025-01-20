import { Router } from 'express';
import * as contactsControllers from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../validation/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contact.js';
import { uploads } from '../middlewares/multer.js';

const router = Router();

router.use(authenticate);

router.get('/', ctrlWrapper(contactsControllers.getContactsController));

router.get(
  '/:contactId',
  isValidId,
  ctrlWrapper(contactsControllers.getContactByIdController),
);

router.post(
  '/',
  // декілька файлів з різними ключами
  // upload.fields([{name: "photo", maxCount: 1}, {name: "subphoto", maxCount: 4}])

  // декілька файлів з одним ключем
  // upload.array("photo", 8)
  uploads.single('photo'),
  validateBody(createContactSchema),
  ctrlWrapper(contactsControllers.createContactController),
);

router.delete(
  '/:contactId',
  isValidId,
  ctrlWrapper(contactsControllers.deleteContactController),
);

router.put(
  '/:contactId',
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(contactsControllers.upsertContactController),
);

router.patch(
  '/:contactId',
  isValidId,
  uploads.single('photo'),
  validateBody(updateContactSchema),
  ctrlWrapper(contactsControllers.patchContactController),
);

export default router;
