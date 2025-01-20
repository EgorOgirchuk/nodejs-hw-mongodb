import createHttpError from 'http-errors';
import * as contactServices from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { saveFileToUploadsDir } from '../utils/saveFileToUploadsDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { deleteFileFromCloudinary } from '../utils/deleteFileFromCloudinary.js';
import { deleteFileFromUploadsDir } from '../utils/deleteFileFromUploadsDir.js';
import { getEnvVar } from '../utils/getEnvVar.js';

export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);

  const { sortBy, sortOrder } = parseSortParams(req.query);

  const filter = parseFilterParams(req.query);

  filter.userId = req.user._id;

  const contacts = await contactServices.getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res) => {
  const { _id: userId } = req.user;
  const { contactId: _id } = req.params;

  const contact = await contactServices.getContact({ _id, userId });

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id ${_id}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  let photo;
  const cloudinaryEnable = getEnvVar('CLOUDINARY_ENABLE') === 'true';
  if (req.file) {
    if (cloudinaryEnable) {
      photo = await saveFileToCloudinary(req.file);
    } else {
      photo = await saveFileToUploadsDir(req.file);
    }
  }

  const { _id: userId } = req.user;
  const contact = await contactServices.createContact({
    ...req.body,
    userId,
    photo,
  });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const upsertContactController = async (req, res) => {
  const { _id: userId } = req.user;
  const { contactId: _id } = req.params;
  const result = await contactServices.updateContact(
    { _id, userId },
    { ...req.body, userId },
    {
      upsert: true,
    },
  );

  if (!result) {
    throw createHttpError(404, 'Contact not found');
  }
  const status = result.isNew ? 201 : 200;

  res.status(status).json({
    status: status,
    message: 'Successfully upserted a contact!',
    data: result.contact,
  });
};

export const patchContactController = async (req, res) => {
  let photo;
  const cloudinaryEnable = getEnvVar('CLOUDINARY_ENABLE') === 'true';
  if (req.file) {
    if (cloudinaryEnable) {
      photo = await saveFileToCloudinary(req.file);
    } else {
      photo = await saveFileToUploadsDir(req.file);
    }
  }

  const { _id: userId } = req.user;
  const { contactId: _id } = req.params;
  const result = await contactServices.updateContact(
    { _id, userId },
    { ...req.body, photo /*photo: photoUrl */ },
  );

  if (!result) {
    throw createHttpError(404, 'Contact not found');
  }
  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result.contact,
  });
};

export const deleteContactController = async (req, res) => {
  const { _id: userId } = req.user;
  const { contactId: _id } = req.params;
  const contact = await contactServices.deleteContact({ _id, userId });

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  const photoUrl = contact.photo;
  if (photoUrl) {
    const cloudName = photoUrl.split('/').includes(getEnvVar('CLOUD_NAME'));
    if (cloudName) {
      await deleteFileFromCloudinary(photoUrl);
    } else {
      await deleteFileFromUploadsDir(photoUrl);
    }
  }

  res.status(204).send();
};
