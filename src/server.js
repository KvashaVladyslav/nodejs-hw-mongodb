import 'dotenv/config';
import express from 'express';
import initMongoConnection from './db/initMongoConnection.js';
import { contactModel } from './models/contact.js';

export default async function setupServer() {
  const app = express();

  app.get('/contacts', async (req, res) => {
    try {
      const contacts = await contactModel.find();
      if (contacts.length === 0) {
        return res.status(404).send('Contact not found');
      }
      res.send({
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

  app.get('/contacts/:contactsId', async (req, res) => {
    try {
      const { contactsId } = req.params;
      const getContactById = await contactModel.findById(contactsId);
      if (getContactById === null) {
        return res.status(404).send('Contact not found');
      }
      res.send({
        status: 200,
        message: `Successfully found contact with id ${contactsId}`,
        data: getContactById,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

  try {
    await initMongoConnection();
    const PORT = Number(process.env.PORT) || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
}
