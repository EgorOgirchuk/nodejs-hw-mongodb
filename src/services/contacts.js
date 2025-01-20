import { ContactsCollection } from '../db/models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/contacts.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
}) => {
  const query = ContactsCollection.find();
  const skip = (page - 1) * perPage;

  if (filter.contactType) {
    query.where('contactType').equals(filter.contactType);
  }
  if (filter.isFavorite) {
    query.where('isFavorite').equals(filter.isFavorite);
  }

  const contactsCount = await ContactsCollection.find()
    .merge(query)
    .countDocuments();

  const contacts = await query
    .skip(skip)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder })
    .exec();

  const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };
};


export const getContactById = (contactId) => ContactsCollection.findById(contactId);

export const createContact = (contactData) => ContactsCollection.create(contactData);

export const deleteContact = (contactId) => ContactsCollection.findByIdAndDelete(contactId);

export const updateContact = async (contactId, contactData, options = {}) => {
  const rawResult = await ContactsCollection.findOneAndUpdate(
    { _id: contactId },
    contactData,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );
  if (!rawResult || !rawResult.value) return null;
  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};
