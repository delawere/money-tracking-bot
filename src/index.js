/* eslint-disable no-unused-vars */
const express = require('express');
const path = require('path');
const _ = require('./env.js');
const Bot = require('./Bot/index.js');

const app = express();

app.get('/', (__, res) => {
  res.sendFile(path.join(`${__dirname}/public/index.html`));
});

app.get('/wakeup', (__, res) => {
  res.json({ status: 'UP' });
});

app.listen(process.env.PORT, async () => {
  console.log('Webpage for NodeJS Daily Bot listening on port 3000');
});

Bot.launch();
