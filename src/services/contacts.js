import { contactModel } from '../models/contact.js';

export function getAllContacts() {
  return contactModel.find();
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
