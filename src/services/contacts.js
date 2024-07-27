import { contactModel } from '../models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export async function getAllContacts({
  page,
  perPage,
  sortBy,
  sortOrder,
  filter,
}) {
  const limit = perPage;
  const skip = page > 0 ? (page - 1) * perPage : 0;

  const contactsQuery = contactModel.find();

  if (filter.isFavourite) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }
  if (filter.contactType) {
    contactsQuery.where('contactType').equals(filter.contactType);
  }

  const [contactsCount, contacts] = await Promise.all([
    contactModel.find().merge(contactsQuery).countDocuments(),
    contactsQuery
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return {
    contacts,
    ...paginationData,
  };
}

export function getOneContactById(contactsId) {
  return contactModel.findById(contactsId);
}

export function createNewContact(contact) {
  return contactModel.create(contact);
}

export function deleteOldContact(contactsId) {
  return contactModel.findByIdAndDelete(contactsId);
}

export function updateOldContact(contactsId, contact) {
  return contactModel.findByIdAndUpdate(contactsId, contact, { new: true });
}
