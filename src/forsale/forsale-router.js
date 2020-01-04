const path = require('path');
const express = require('express');
const xss = require('xss');
const ForsaleService = require('./forsale-service');

const forsaleRouter = express.Router();
const jsonParser = express.json();

const serializeItem = item => ({
  id: item.id,
  item_owner: item.item_owner,
  item_name: xss(item.item_name),
  item_body: xss(item.item_body),
  item_is: item.item_is,
  item_list: item.item_list
});

//the forsale view does not need post and delete. just get methods...
forsaleRouter
  .route('/')
  .get((req, res, next) => {
    ForsaleService.getAllItems(
      req.app.get('db')
    )
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
      const {
        item_name,
        item_body,
        item_is,
        item_list,
        item_owner
      } = req.body;

      const newItem = {
        item_name,
        item_body,
        item_is,
        item_list,
        item_owner
      };

      const requiredFields = {
        item_name,
        item_list,
        item_is
      };

      for (const [
        key,
        value
      ] of requiredFields) {
        if (value == null) {
          return res.status(400).json({
            error: {
              message: `Missing '${key}' in request body`
            }
          });
        }
      }

      ForsaleService.insertItem(
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

forsaleRouter
  .route('/:item_id')
  .all((req, res, next) => {
    ForsaleService.getById(
      req.app.get('db'),
      req.params.item_id
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
  });
// .delete((req, res, next) => {
//   ForsaleService.deleteItem(
//     req.app.get('db'),
//     req.params.item_id
//   )
//     .then(() => {
//       res.status(204).end();
//     })
//     .catch(next);
// })
// .patch(
//   jsonParser,
//   (req, res, next) => {
//     const {
//       title,
//       content,
//       style
//     } = req.body;
//     const itemToUpdate = {
//       title,
//       content,
//       style
//     };
//     const numberOfValues = Object.values(
//       itemToUpdate
//     ).filter(Boolean).length;
//     if (numberOfValues === 0) {
//       return res.status(400).json({
//         error: {
//           message:
//             "Request body must contain either 'title', 'style' or 'content'"
//         }
//       });
//     }
//     ForsaleService.updateItem(
//       req.app.get('db'),
//       req.params.item_id,
//       itemToUpdate
//     )
//       .then(numRowsAffected => {
//         res.status(204).end();
//       })
//       .catch(next);
//   }
// );

module.exports = forsaleRouter;
