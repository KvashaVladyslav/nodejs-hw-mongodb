import setupServer from './server.js';
import initMongoConnection from './db/initMongoConnection.js';

async function server() {
  await initMongoConnection();
  setupServer();
}

server();
