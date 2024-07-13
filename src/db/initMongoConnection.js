import 'dotenv/config';

import mongoose from 'mongoose';

export default async function initMongoConnection() {
  try {
    const DB_URI = process.env.DB_URI;
    await mongoose.connect(DB_URI);
    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.error(error);
    throw error;
  }
}
