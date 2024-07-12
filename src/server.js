import express from 'express';

export default function setupServer() {
  const app = express();

  app.get('/', function (req, res) {
    res.send('Hello world!');
  });
}
