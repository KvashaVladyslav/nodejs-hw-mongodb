import 'dotenv/config';

import mongoose from 'mongoose';

export default async function initMongoConnection() {
  try {
    const name = process.env.MONGODB_USER;
    const password = process.env.MONGODB_PASSWORD;
    const url = process.env.MONGODB_URL;
    const db = process.env.MONGODB_DB;
    await mongoose.connect(
      `mongodb+srv://${name}:${password}@${url}/${db}?retryWrites=true&w=majority`,
    );
    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.error(error);
    throw error;
  }
}
