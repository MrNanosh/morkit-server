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
// const message-router = require('./message/message-router');
// const router = require('./inventory/inventory-router');
// const router = require('./user/user-router');
// const router = require('./forsale/forsale-router');

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
app.get('/', (req, res) => {
  res.send('helloworld');
});
app.get(
  '/api/forsale',
  (req, res, next) => {
    // console.log('forsale');
    res.json([
      {
        id: 1,
        item_name: 'item1',
        item_body:
          'this is an original item1, for sale, low price',
        item_owner: 7,
        item_is: 'selling',
        item_list: 1
      },
      {
        id: 2,
        item_name: 'item2',
        item_body:
          'this is an original item2, for sale, low price',
        item_owner: 6,
        item_is: 'selling',
        item_list: 1
      }
    ]);
  }
);
app.get('/api/message', (req, res) => {
  res.json(['these messages']);
});
app.get(
  '/api/inventory',
  (req, res) => {
    res.json({
      items: [
        {
          id: 1,
          item_name: 'item1',
          item_body:
            'this is an original item1, for sale, low price',
          item_owner: 1,
          item_is: 'selling',
          item_list: 2
        },
        {
          id: 2,
          item_name: 'item2',
          item_body:
            'this is an original item1, for sale, low price',
          item_owner: 1,
          item_is: 'selling',
          item_list: 2
        },
        {
          id: 5,
          item_name: 'item5',
          item_body:
            'this is an original item1, for sale, low price',
          item_owner: 1,
          item_is: 'selling',
          item_list: 3
        },
        {
          id: 4,
          item_name: 'item4',
          item_body:
            'this is an original item1, for sale, low price',
          item_owner: 1,
          item_is: 'selling',
          item_list: 4
        }
      ],
      lists: [
        {
          id: 1,
          list_owner: 1,
          list_name: 'galaxies for sale'
        },
        {
          id: 2,
          list_owner: 1,
          list_name:
            'lightsabers on da cheap'
        },
        {
          id: 4,
          list_owner: 1,
          list_name: 'Sith Cloaks'
        },
        {
          id: 3,
          list_owner: 1,
          list_name: 'swamp properties'
        }
      ]
    });
  }
);
// app.use('/api/message', message-router)
// app.use('/api/inventory', inventory-router)
// app.use('/api/user', user-router)
// app.use('/api/forsale', forsale-router)

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
