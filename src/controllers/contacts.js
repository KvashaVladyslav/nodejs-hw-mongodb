import createHttpError from 'http-errors';
import * as ContactsService from '../services/contacts.js';

export async function getContacts(req, res) {
  const contacts = await ContactsService.getAllContacts();
  if (contacts.length === 0) {
    res.status(404).send({ status: 404, message: 'Contacts not found' });
  }
  res.status(200).send({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
}

export async function getContactById(req, res, next) {
  const { contactsId } = req.params;
  const getContactById = await ContactsService.getOneContactById(contactsId);
  if (getContactById === null) {
    return next(createHttpError(404, 'Contact not found!'));
  }
  res.status(200).send({
    status: 200,
    message: `Successfully found contact with id ${contactsId}`,
    data: getContactById,
  });
}

export async function createContact(req, res, next) {
  const contact = {
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    isFavourite: req.body.isFavourite,
    contactType: req.body.contactType,
  };
  const newContact = await ContactsService.createNewContact(contact);
  res.status(201).send({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
}

export async function deleteContact(req, res, next) {
  const { contactsId } = req.params;
  const deleted = await ContactsService.deleteOldContact(contactsId);
  if (deleted === null) {
    return next(createHttpError(404, 'Contact not found!'));
  }
  res.status(204).end();
}

export async function updateContact(req, res, next) {
  const { contactsId } = req.params;
  const contact = {
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    isFavourite: req.body.isFavourite,
    contactType: req.body.contactType,
  };
  const updated = await ContactsService.updateOldContact(contactsId, contact);
  if (updated === null) {
    return next(createHttpError(404, 'Contact not found!'));
  }
  res.status(200).send({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updated,
  });
}
