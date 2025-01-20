import { Router } from 'express';
import * as contactsControllers from '../controllers/contacts.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = Router();

router.get('/', ctrlWrapper(contactsControllers.getContactsController));
router.get('/:contactId', ctrlWrapper(contactsControllers.getContactByIdController),);

router.post('/', ctrlWrapper(contactsControllers.createContactController));

router.delete('/:contactId', ctrlWrapper(contactsControllers.deleteContactController),);

router.put('/:contactId', ctrlWrapper(contactsControllers.upsertContactController),);

router.patch('/:contactId', ctrlWrapper(contactsControllers.patchContactController),);

export default router;
