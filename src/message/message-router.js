const path = require('path');
const express = require('express');
const xss = require('xss');
const MessagesService = require('./message-service');

const messagesRouter = express.Router();
const jsonParser = express.json();

const serializeMessage = message => ({
  id: message.id,
  content: xss(message.content),
  sender_id: message.sender_id,
  receiver_id: message.receiver_id,
  item_id: message.item_id,
  send_time: message.send_time,
  buy: message.buy,
  check_available:
    message.check_available,
  rsp_buy: message.rsp_buy,
  rsp_time: message.rsp_time,
  rsp_check: message.rsp_check,
  rsp_both: message.rsp_both,
  rsp_content: xss(message.rsp_content),
  receiver_name: xss(
    message.receiver_name
  ),
  sender_name: xss(message.sender_name),
  receiver_fullname: xss(
    message.receiver_fullname
  ),
  sender_fullname: xss(
    message.sender_fullname
  ),
  item_name: xss(message.item_name)
});

messagesRouter
  .route('/')
  .get((req, res, next) => {
    MessagesService.getAllMessages(
      req.app.get('db')
    ) //equals knexInstance
      .then(messages => {
        res.json(
          messages.map(serializeMessage)
        );
      })
      .catch(next);
  })
  .post(
    jsonParser,
    (req, res, next) => {
      let authuser = 2;
      const {
        content,
        sender_id,
        receiver_id,
        item_id,
        send_time,
        buy,
        check_available,
        rsp_buy,
        rsp_time,
        rsp_check,
        rsp_both,
        rsp_content
      } = req.body;
      const newMessage = {
        content,
        receiver_id,
        item_id,
        buy,
        check_available
      };

      for (const [
        key,
        value
      ] of Object.entries(newMessage)) {
        if (value == null) {
          return res.status(400).json({
            error: {
              message: `Missing '${key}' in request body`
            }
          });
        }
      }

      newMessage.sender_id = authuser;
      newMessage.send_time = new Date();
      newMessage.rsp_buy = null;
      newMessage.rsp_time = null;
      newMessage.rsp_check = null;
      newMessage.rsp_both = null;
      newMessage.rsp_content = null;

      MessagesService.insertMessage(
        req.app.get('db'),
        newMessage
      )
        .then(message => {
          res
            .status(201)
            .location(
              path.posix.join(
                req.originalUrl +
                  `/${message.id}`
              )
            )
            .json(
              serializeMessage(message)
            );
        })
        .catch(next);
    }
  );

messagesRouter
  .route('/:message_id')
  .all((req, res, next) => {
    MessagesService.getById(
      req.app.get('db'),
      req.params.message_id
    )
      .then(message => {
        if (!message) {
          return res.status(404).json({
            error: {
              message:
                "Message doesn't exist"
            }
          });
        }
        res.message = message; // save the message for the next middleware
        next(); // don't forget to call next so the next middleware happens!
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(
      serializeMessage(res.message)
    );
  })
  .delete((req, res, next) => {
    MessagesService.deleteMessage(
      req.app.get('db'),
      req.params.message_id
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
        rsp_buy,
        rsp_time,
        rsp_check,
        rsp_both,
        rsp_content
      } = req.body;
      const messageToUpdate = {
        rsp_buy,
        rsp_check,
        rsp_both,
        rsp_content
      };

      const numberOfValues = Object.values(
        messageToUpdate
      ).filter(Boolean).length;

      if (numberOfValues === 0) {
        return res.status(400).json({
          error: {
            message:
              "Request body must contain either 'title', 'style' or 'content'"
          }
        });
      }

      messageToUpdate.rsp_time = new Date();

      MessagesService.updateMessage(
        req.app.get('db'),
        req.params.message_id,
        messageToUpdate
      )
        .then(numRowsAffected => {
          res.status(204).end();
        })
        .catch(next);
    }
  );

module.exports = messagesRouter;
