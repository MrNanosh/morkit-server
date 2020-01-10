require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const {
  NODE_ENV
} = require('./config');

const app = express();

const morganOption =
  NODE_ENV === 'production'
    ? 'tiny'
    : 'common';
const messageRouter = require('./message/message-router');
const inventoryRouter = require('./inventory/inventory-router');
const listRouter = require('./list/list-router');
const forsaleRouter = require('./forsale/forsale-router');

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.use('/api/message', messageRouter);
app.use(
  '/api/inventory',
  inventoryRouter
);
// app.use('/api/user', user-router)
app.use('/api/forsale', forsaleRouter);
app.use('/api/list', listRouter);

app.use(function errorHandler(
  error,
  req,
  res,
  next
) {
  let response;
  if (NODE_ENV === 'production') {
    response = {
      error: { message: 'server error' }
    };
  } else {
    console.error(error);
    response = {
      message: error.message,
      error
    };
  }
  res.status(500).json(response);
});

module.exports = app;
