const path = require('path');

const envPath = path.resolve(__dirname, '../.env');
require('dotenv').config({ path: envPath });

const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const pmx = require('pmx');
const { logger } = require('../utils');

const log = logger('server');
const PORT = process.env.PORT || 7000;
const webhookRouter = require('./endpoints/webhooks');
// const newsRouter = require('./endpoints/news');

const app = express();
const probe = pmx.probe();

const reqPerHour = probe.meter({
  name: 'Requests per hour',
  samples: 60 * 60
});
const reqPerMin = probe.meter({
  name: 'Requests per minute',
  samples: 60
});
const reqPerSec = probe.meter({
  name: 'Requests per second',
  samples: 1
});

const probes = [reqPerHour, reqPerMin, reqPerSec];

app.use('*', (req, res, next) => {
  probes.forEach(probe => probe.mark());
  next();
});

// diasble this until the rollout of news
// app.use('/news/v1', newsRouter);

// webhooks
app.use('/webhook', webhookRouter);

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('views', path.resolve(__dirname, './views'));
app.set('view engine', 'pug');

app.get('*', (req, res) => {
  res.render('noRoute', { route: req.originalUrl });
});

const noMail = (req, res) => {
  res.json({ error: 'No mail thank you' }).end();
};

app.post('*', noMail);
app.put('*', noMail);

app.listen(PORT, () => {
  log(`API server listening on port ${PORT}!`);
});
