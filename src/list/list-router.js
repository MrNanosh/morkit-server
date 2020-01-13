const path = require('path');
const express = require('express');
const xss = require('xss');
const ListService = require('./list-service');

const listRouter = express.Router();
const jsonParser = express.json();

const serializeList = list => ({
  id: list.id,
  list_owner: list.list_owner,
  list_name: xss(list.list_name),
  owner_name: list.owner_name
});

listRouter
  .route('/')
  .get((req, res, next) => {
    let authuser = 2;

    ListService.getAllLists(
      req.app.get('db'),
      authuser
    ) //equals knexInstance
      .then(lists => {
        res.json(
          lists.map(serializeList)
        );
      })
      .catch(next);
  })
  .post(
    jsonParser,
    (req, res, next) => {
      const {
        list_owner,
        list_name
      } = req.body;
      const newList = {
        list_name
      };

      for (const [
        key,
        value
      ] of Object.entries(newList)) {
        if (value == null) {
          return res.status(400).json({
            error: {
              message: `Missing '${key}' in request body`
            }
          });
        }
      }

      let authuser = 2;
      newList.list_owner = authuser;

      ListService.insertList(
        req.app.get('db'),
        newList
      )
        .then(list => {
          res
            .status(201)
            .location(
              path.posix.join(
                req.originalUrl +
                  `/${list.id}`
              )
            )
            .json(serializeList(list));
        })
        .catch(next);
    }
  );

listRouter
  .route('/:list_id')
  .all((req, res, next) => {
    let authuser = 2;
    ListService.getById(
      req.app.get('db'),
      req.params.list_id,
      authuser
    )
      .then(list => {
        if (!list) {
          return res.status(404).json({
            error: {
              message:
                "List doesn't exist"
            }
          });
        }
        res.list = list; // save the list for the next middleware
        next(); // don't forget to call next so the next middleware happens!
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializeList(res.list));
  })
  .delete((req, res, next) => {
    ListService.deleteList(
      req.app.get('db'),
      req.params.list_id
    )
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(
    jsonParser,
    (req, res, next) => {
      const { list_name } = req.body;
      const listToUpdate = {
        list_name
      };
      const numberOfValues = Object.values(
        listToUpdate
      ).filter(Boolean).length;
      if (numberOfValues === 0) {
        return res.status(400).json({
          error: {
            message:
              "Request body must contain either 'title', 'style' or 'content'"
          }
        });
      }
      ListService.updateList(
        req.app.get('db'),
        req.params.list_id,
        listToUpdate
      )
        .then(numRowsAffected => {
          res.status(204).end();
        })
        .catch(next);
    }
  );

module.exports = listRouter;
