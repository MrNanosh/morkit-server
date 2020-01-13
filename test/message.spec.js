const knex = require('knex');
const app = require('../src/app');
const {
  makeItemsArray
} = require('./items.fixtures');
const {
  makeUsersArray
} = require('./users.fixtures');
const {
  makeExpectedMessages
} = require('./messages.expectations');
const {
  makeMessagesArray
} = require('./messages.fixtures');
const {
  makeListsArray
} = require('./lists.fixtures');

describe('Inventory Endpoints', function() {
  let db;

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection:
        process.env.TEST_DATABASE_URL
    });
    app.set('db', db);
  });

  after('disconnect from db', () =>
    db.destroy()
  );
  before('clean the table', () =>
    db.raw(
      `TRUNCATE inventory, category_list,
      morkit_user, msg
       RESTART IDENTITY CASCADE`
    )
  );
  afterEach('cleanup', () =>
    db.raw(
      `TRUNCATE inventory, category_list,
      morkit_user, msg
       RESTART IDENTITY CASCADE`
    )
  );

  describe('GET /api/inventory', () => {
    context('Given no messages', () => {
      it('responds with 200 and an empty list', () => {
        return supertest(app)
          .get('/api/inventory')
          .expect(200, []);
      });
    });

    context(
      'Given there are messages in the inventory',
      () => {
        const testItems = makeItemsArray();
        const testUsers = makeUsersArray();
        const testLists = makeListsArray();

        beforeEach(
          'insert inventory',
          () => {
            return db
              .into('morkit_user')
              .insert(testUsers)
              .then(() => {
                return db
                  .into('category_list')
                  .insert(testLists)
                  .then(() => {
                    return db
                      .into('inventory')
                      .insert(
                        testItems
                      );
                  });
              });
          }
        );

        it('GET /api/message responds with 200 and the messages for authorized user', () => {
          const expectedMessages = makeExpectedMessages().filter(
            message =>
              Number(
                message.item_owner
              ) === 2
          );

          return supertest(app)
            .get('/api/message')
            .expect(
              200,
              expectedMessages
            );
        });
      }
    );

    context(
      `Given an XSS attack message`,
      () => {
        const maliciousMessage = {
          ...makeMessagesArray()[0],
          id: 911,
          content:
            'Naughty naughty very naughty <script>alert("xss");</script>'
        };
        const expectedMessage = {
          ...maliciousMessage,
          content:
            'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;'
        };
        const testUsers = makeUsersArray();
        const testLists = makeListsArray();
        const testItems = makeItemsArray();

        beforeEach(
          'insert inventory',
          () => {
            return db
              .into('morkit_user')
              .insert(testUsers)
              .then(() => {
                return db
                  .into('category_list')
                  .insert(testLists)
                  .then(() => {
                    return db
                      .into('inventory')
                      .insert(testItems)
                      .then(() => {
                        return db
                          .into('msg')
                          .insert(
                            maliciousMessage
                          );
                      });
                  });
              });
          }
        );

        it('removes XSS attack content', () => {
          return supertest(app)
            .get(`/api/message`)
            .expect(200)
            .expect(res => {
              expect(
                res.body[0].content
              ).to.eql(
                expectedMessage.content
              );
            });
        });
      }
    );
  });

  describe('GET /api/inventory/:item_id', () => {
    context(
      'Given no inventory',
      () => {
        it('responds with 404', () => {
          const msgId = 123456;
          return supertest(app)
            .get(
              `/api/message/${msgId}`
            )
            .expect(404, {
              error: {
                message:
                  "Message doesn't exist"
              }
            });
        });
      }
    );

    context(
      'Given there is inventory in the database',
      () => {
        context(
          'Given an XSS attack item',
          () => {
            const maliciousMessage = {
              ...makeMessagesArray()[0],
              id: 911,
              content:
                'Naughty naughty very naughty <script>alert("xss");</script>'
            };

            beforeEach(
              'insert inventory',
              () => {
                return db
                  .into('msg')
                  .insert(
                    maliciousMessage
                  );
              }
            );

            it('removes XSS attack content', () => {
              return supertest(app)
                .get(
                  `/api/message/${maliciousMessage.id}`
                )
                .expect(200)
                .expect(res => {
                  expect(
                    res.body.content
                  ).to.eql(
                    'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;'
                  );
                });
            });
          }
        );
        const testUsers = makeUsersArray();
        const testLists = makeListsArray();
        const testItems = makeItemsArray();
        const testMessages = makeMessagesArray();

        beforeEach(
          'insert inventory',
          () => {
            return db
              .into('morkit_user')
              .insert(testUsers)
              .then(() => {
                return db
                  .into('category_list')
                  .insert(testLists)
                  .then(() => {
                    return db
                      .into('inventory')
                      .insert(testItems)
                      .then(() => {
                        return db
                          .into('msg')
                          .insert(
                            testMessages
                          );
                      });
                  });
              });
          }
        );

        it('responds with 200 and the specified item', () => {
          const msgId = 2;
          const expectedMessage = makeExpectedMessages()[0];
          return supertest(app)
            .get(
              `/api/message/${msgId}`
            )
            .expect(
              200,
              expectedMessage
            );
        });
      }
    );
  });

  describe('POST /api/message', () => {
    const testUsers = makeUsersArray();
    const testLists = makeListsArray();
    const testItems = makeItemsArray();

    beforeEach(
      'insert inventory',
      () => {
        return db
          .into('morkit_user')
          .insert(testUsers)
          .then(() => {
            return db
              .into('category_list')
              .insert(testLists)
              .then(() => {
                return db
                  .into('inventory')
                  .insert(testItems);
              });
          });
      }
    );

    it('creates an message, responding with 201 and the new message', function() {
      const newMessage = {
        ...makeMessagesArray()[4],
        sender_id: 2, //should automatically become 2 but sender_id is required for a post
        send_time: null // should reset anyways
      };

      return supertest(app)
        .post('/api/message')
        .send(newMessage)
        .expect(201)
        .expect(res => {
          expect(
            res.body.content
          ).to.eql(newMessage.content);
          expect(
            res.body.sender_id
          ).to.eql(2); // the auth user is hardcoded to 2 all new items belong to 2
          expect(
            res.body.receiver_id
          ).to.eql(
            newMessage.receiver_id
          );
          expect(res.body.buy).to.eql(
            newMessage.buy
          );
          expect(
            res.body.item_id
          ).to.eql(newMessage.item_id);
          expect(
            res.body.check_available
          ).to.eql(
            newMessage.check_available
          );
          expect(
            res.body
          ).to.have.property('id');
          expect(
            res.body
          ).to.have.property('rsp_buy');
          expect(
            res.body
          ).to.have.property(
            'rsp_check'
          );
          expect(
            res.body
          ).to.have.property(
            'rsp_both'
          );
          expect(
            res.body
          ).to.have.property(
            'rsp_time'
          );
          expect(
            res.body
          ).to.have.property(
            'rsp_content'
          );
          expect(
            res.body
          ).to.have.property(
            'send_time'
          );
          expect(
            res.headers.location
          ).to.eql(
            `/api/message/${res.body.id}`
          );
        })
        .then(postRes =>
          supertest(app)
            .get(
              `/api/message/${postRes.body.id}`
            )
            .expect({
              ...postRes.body
            })
        );
    });

    const requiredFields = [
      'content',
      'check_available',
      'buy',
      'sender_id',
      'receiver_id',
      'item_id'
    ];

    requiredFields.forEach(field => {
      const newMessage = {
        sender_id: 2,
        receiver_id: 5,
        item_id: 1043,
        content: '', //content is required but may be an empty string
        check_available: true,
        buy: true
      };

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newMessage[field];

        return supertest(app)
          .post('/api/message')
          .send(newMessage)
          .expect(400, {
            error: {
              message: `Missing '${field}' in request body`
            }
          });
      });
    });

    it('removes XSS attack content from response', () => {
      const maliciousMessage = {
        ...makeMessagesArray()[4],
        id: 911,
        content:
          'Naughty naughty very naughty <script>alert("xss");</script>'
      };

      const expectedItem = {
        ...maliciousMessage,
        content:
          'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;'
      };

      return supertest(app)
        .post('/api/message')
        .send(maliciousMessage)
        .expect(201)
        .expect(res => {
          expect(
            res.body.content
          ).to.eql(
            expectedItem.content
          );
        });
    });
  });

  describe(`DELETE /api/message/:message_id`, () => {
    context(`Given no message`, () => {
      it(`responds with 404`, () => {
        const msgId = 123456;
        return supertest(app)
          .delete(
            `/api/message/${msgId}`
          )
          .expect(404, {
            error: {
              message: `Message doesn't exist`
            }
          });
      });
    });

    context(
      'Given there are messages in the database',
      () => {
        const testItems = makeItemsArray();
        const testUsers = makeUsersArray();
        const testLists = makeListsArray();
        const testMessages = makeMessagesArray();

        beforeEach(
          'insert messages',
          () => {
            return db
              .into('morkit_user')
              .insert(testUsers)
              .then(() => {
                return db
                  .into('category_list')
                  .insert(testLists)
                  .then(() => {
                    return db
                      .into('inventory')
                      .insert(testItems)
                      .then(() => {
                        return db
                          .into('msg')
                          .insert(
                            testMessages
                          );
                      });
                  });
              });
          }
        );

        it('responds with 204 and removes the item', () => {
          const idToRemove = 1000;
          const expectedMessages = makeExpectedMessages().filter(
            msg => msg.id !== idToRemove
          );
          return supertest(app)
            .delete(
              `/api/message/${idToRemove}`
            )
            .expect(204)
            .then(res =>
              supertest(app)
                .get(`/api/message`)
                .expect(
                  expectedMessages
                )
            );
        });
      }
    );
  });

  describe(`PATCH /api/message/:message_id`, () => {
    context(`Given no messages`, () => {
      it(`responds with 404`, () => {
        const msgId = 123456;
        return supertest(app)
          .patch(
            `/api/message/${msgId}`
          )
          .expect(404, {
            error: {
              message: `Message doesn't exist`
            }
          });
      });
    });

    context(
      'Given there are messages in the database',
      () => {
        const testItems = makeItemsArray();
        const testUsers = makeUsersArray();
        const testLists = makeListsArray();
        const testMessages = makeMessagesArray();
        this.retries(3);

        beforeEach(
          'insert items',
          () => {
            return db
              .into('morkit_user')
              .insert(testUsers)
              .then(() => {
                return db
                  .into('category_list')
                  .insert(testLists)
                  .then(() => {
                    return db
                      .into('inventory')
                      .insert(testItems)
                      .then(() => {
                        return db
                          .into('msg')
                          .insert(
                            testMessages
                          );
                      });
                  });
              });
          }
        );

        it('responds with 204 and updates the item', () => {
          const idToUpdate = 1003;
          const updateMessage = {
            rsp_buy: 'no',
            rsp_check: 'yes',
            rsp_both: 'maybe',
            rsp_time: new Date(),
            rsp_content:
              'I have just changed this.'
          };
          const expectedMessage = {
            ...makeExpectedMessages()[7],
            ...updateMessage
          };
          expectedMessage.rsp_time = expectedMessage.rsp_time.toLocaleString();
          return supertest(app)
            .patch(
              `/api/message/${idToUpdate}`
            )
            .send(updateMessage)
            .expect(204)
            .then(res =>
              supertest(app)
                .get(
                  `/api/message/${idToUpdate}`
                )
                .expect(res => {
                  res.body.rsp_time = new Date(
                    res.body.rsp_time
                  ).toLocaleString();
                  expect(
                    res.body
                  ).to.eql(
                    expectedMessage
                  );
                })
            );
        });

        it(`responds with 400 when no required fields supplied`, () => {
          const idToUpdate = 1005;
          return supertest(app)
            .patch(
              `/api/message/${idToUpdate}`
            )
            .send({
              irrelevantField: 'foo'
            })
            .expect(400, {
              error: {
                message:
                  "Request body must contain either 'rsp_buy', 'rsp_check', 'rsp_both' or 'rsp_content'"
              }
            });
        });

        it(`responds with 204 when updating only a subset of fields`, () => {
          this.retries(3);
          const idToUpdate = 1003;
          const updateMessage = {
            rsp_content:
              'updated content'
          };
          const expected_rsp_time = new Date().toLocaleString();

          const expectedMessage = {
            ...makeExpectedMessages()[7],
            ...updateMessage
          };

          return supertest(app)
            .patch(
              `/api/message/${idToUpdate}`
            )
            .send({
              ...updateMessage,
              fieldToIgnore:
                'should not be in GET response'
            })
            .expect(204)
            .then(res =>
              supertest(app)
                .get(
                  `/api/message/${idToUpdate}`
                )
                .expect(res => {
                  res.body.rsp_time = new Date(
                    res.body.rsp_time
                  ).toLocaleString();
                  expectedMessage.rsp_time = expected_rsp_time;
                  expect(
                    res.body
                  ).to.eql(
                    expectedMessage
                  );
                })
            );
        });
      }
    );
  });
});
