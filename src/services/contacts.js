import { contactModel } from '../models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export async function getAllContacts({
  page,
  perPage,
  sortBy,
  sortOrder,
  filter,
  userId,
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

  contactsQuery.where('userId').equals(userId);

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

export function getOneContactById(contactsId, userId) {
  return contactModel.findOne({ _id: contactsId, userId });
}

export function createNewContact(contact) {
  return contactModel.create(contact);
}

export function deleteOldContact(contactsId, userId) {
  return contactModel.findOneAndDelete({ _id: contactsId, userId });
}

export function updateOldContact(contactsId, contact, userId) {
  return contactModel.findOneAndUpdate({ _id: contactsId, userId }, contact, {
    new: true,
  });
}
