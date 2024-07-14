import 'dotenv/config';
import express from 'express';
import initMongoConnection from './db/initMongoConnection.js';
import { contactModel } from './models/contact.js';
import cors from 'cors';
import pino from 'pino-http';

export default async function setupServer() {
  const app = express();

  app.use(
    cors({
      origin: 'http://localhost:3000',
      optionsSuccessStatus: 200,
    }),
  );

  app.use(pino());

  app.get('/contacts', async (req, res) => {
    try {
      const contacts = await contactModel.find();
      if (contacts.length === 0) {
        res.status(404).send('Contact not found');
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
      console.log(getContactById);
      if (getContactById === null) {
        res.status(404).send('Contact not found');
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

  app.use((req, res, next) => {
    res.status(404).send({ message: 'Not found' });
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
