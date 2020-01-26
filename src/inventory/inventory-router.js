const path = require('path');
const express = require('express');
const xss = require('xss');
const InventoryService = require('./inventory-service');

const inventoryRouter = express.Router();
const jsonParser = express.json();

const serializeItem = item => ({
  id: item.id,
  item_name: xss(item.item_name),
  item_body: xss(item.item_body),
  item_is: item.item_is,
  item_list: item.item_list,
  item_owner: item.item_owner,
  owner_name: item.owner_name
});

inventoryRouter
  .route('/')
  .get((req, res, next) => {
    const authuser = 2; //needs to be able to change user for the future
    InventoryService.getAllItems(
      req.app.get('db'),
      authuser
    ) //equals knexInstance
      .then(items => {
        res.json(
          items.map(serializeItem)
        );
      })
      .catch(next);
  })
  .post(
    jsonParser,
    (req, res, next) => {
      const authuser = 2; //needs to be able to change user for the future

      const {
        item_name,
        item_body,
        item_is,
        item_list,
        item_owner
      } = req.body;

      const newItem = {
        item_name,
        item_is,
        item_list
      };

      for (const [
        key,
        value
      ] of Object.entries(newItem)) {
        if (value == null) {
          return res.status(400).json({
            error: {
              message: `Missing '${key}' in request body`
            }
          });
        }
      }

      newItem.item_owner = authuser; //spoof auth

      if (
        String(authuser) !==
        String(newItem.item_owner)
      ) {
        return res.status(401).json({
          error: {
            message:
              'Only authorized user can post to this account'
          }
        });
      }

      newItem.item_body = item_body;

      InventoryService.insertItem(
        req.app.get('db'),
        newItem
      )
        .then(item => {
          res
            .status(201)
            .location(
              path.posix.join(
                req.originalUrl +
                  `/${item.id}`
              )
            )
            .json(serializeItem(item));
        })
        .catch(next);
    }
  );

inventoryRouter
  .route('/:item_id')
  .all((req, res, next) => {
    const authuser = 2; //needs to be able to change user for the future

    InventoryService.getById(
      req.app.get('db'),
      req.params.item_id,
      authuser
    )
      .then(item => {
        if (!item) {
          return res.status(404).json({
            error: {
              message:
                "Item doesn't exist"
            }
          });
        }
        res.item = item; // save the item for the next middleware
        next(); // don't forget to call next so the next middleware happens!
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializeItem(res.item));
  })
  .delete((req, res, next) => {
    InventoryService.deleteItems(
      req.app.get('db'),
      req.params.item_id
    )
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(
    jsonParser,
    (req, res, next) => {
      const {
        item_name,
        item_body,
        item_is,
        item_list,
        item_owner
      } = req.body;

      const itemToUpdate = {
        item_name,
        item_body,
        item_is,
        item_list,
        item_owner
      };

      let numberOfValues = Object.values(
        itemToUpdate
      ).filter(Boolean).length;
      if (
        item_name === '' ||
        item_body === ''
      ) {
        numberOfValues++;
      }
      if (numberOfValues === 0) {
        return res.status(400).json({
          error: {
            message:
              "Request body must contain either 'item_name', 'item_body','item_list' or 'item_is'"
          }
        });
      }

      InventoryService.updateItem(
        req.app.get('db'),
        req.params.item_id,
        itemToUpdate
      )
        .then(numRowsAffected => {
          res.status(204).end();
        })
        .catch(next);
    }
  );

module.exports = inventoryRouter;
