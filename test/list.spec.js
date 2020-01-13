const knex = require('knex');
const app = require('../src/app');
const {
  makeItemsArray
} = require('./items.fixtures');
const {
  makeUsersArray
} = require('./users.fixtures');
const {
  makeExpectedItems
} = require('./items.expectations');
const {
  makeListsArray
} = require('./lists.fixtures');
const {
  makeExpectedLists
} = require('./list.expectations');

describe('List Endpoints', function() {
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

  describe('GET /api/list', () => {
    context('Given no list', () => {
      it('responds with 200 and an empty list', () => {
        return supertest(app)
          .get('/api/list')
          .expect(200, []);
      });
    });

    context(
      'Given there are items in the list',
      () => {
        const testUsers = makeUsersArray();
        const testLists = makeListsArray();

        beforeEach(
          'insert list',
          () => {
            return db
              .into('morkit_user')
              .insert(testUsers)
              .then(() => {
                return db
                  .into('category_list')
                  .insert(testLists);
              });
          }
        );

        it('GET /api/list responds with 200 and part of the list for authorized user', () => {
          const expectedLists = makeExpectedLists();
          return supertest(app)
            .get('/api/list')
            .expect(200, expectedLists);
        });
      }
    );

    context(
      `Given an XSS attack list item`,
      () => {
        const maliciousItem = {
          id: 911,
          list_name:
            'Naughty naughty very naughty <script>alert("xss");</script>',
          list_owner: 2
        };
        const expectedItem = {
          ...maliciousItem,
          list_name:
            'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;'
        };
        const testUsers = makeUsersArray();
        const testLists = makeListsArray();

        beforeEach(
          'insert list',
          () => {
            return db
              .into('morkit_user')
              .insert(testUsers)
              .then(() => {
                return db
                  .into('category_list')
                  .insert(testLists);
              });
          }
        );

        it('removes XSS attack content', () => {
          return supertest(app)
            .get(`/api/list`)
            .expect(200)
            .expect(res => {
              expect(
                res.body[0].item_name
              ).to.eql(
                expectedItem.item_name
              );
              expect(
                res.body[0].item_body
              ).to.eql(
                expectedItem.item_body
              );
            });
        });
      }
    );
  });

  describe('GET /api/list/:list_id', () => {
    context('Given no list', () => {
      it('responds with 404', () => {
        const listId = 123456;
        return supertest(app)
          .get(`/api/list/${listId}`)
          .expect(404, {
            error: {
              message:
                "List doesn't exist"
            }
          });
      });
    });

    context(
      'Given there is list in the database',
      () => {
        context(
          'Given an XSS attack item',
          () => {
            const maliciousList = {
              id: 911,
              list_name:
                'Naughty naughty very naughty <script>alert("xss");</script>',
              list_owner: 2
            };

            beforeEach(
              'insert list',
              () => {
                return db
                  .into('category_list')
                  .insert(
                    maliciousList
                  );
              }
            );

            it('removes XSS attack content', () => {
              return supertest(app)
                .get(
                  `/api/list/${maliciousList.id}`
                )
                .expect(200)
                .expect(res => {
                  expect(
                    res.body.list_name
                  ).to.eql(
                    'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;'
                  );
                });
            });
          }
        );
        const testUsers = makeUsersArray();
        const testLists = makeListsArray();

        beforeEach(
          'insert list',
          () => {
            return db
              .into('morkit_user')
              .insert(testUsers)
              .then(() => {
                return db
                  .into('category_list')
                  .insert(testLists);
              });
          }
        );

        it('responds with 200 and the specified list', () => {
          const listId = 2;
          const expectedList = makeExpectedLists()[0];
          return supertest(app)
            .get(`/api/list/${listId}`)
            .expect(200, expectedList);
        });
      }
    );
  });

  describe('POST /api/inventory', () => {
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
              .insert(testLists);
          });
      }
    );

    it('creates an item, responding with 201 and the new item', function() {
      const newItem = {
        id: 1,
        item_name: 'maltese falcon',
        item_body: '',
        item_is: 'selling',
        item_list: 6
      };
      return supertest(app)
        .post('/api/inventory')
        .send(newItem)
        .expect(201)
        .expect(res => {
          expect(
            res.body.item_name
          ).to.eql(newItem.item_name);
          expect(
            res.body.item_owner
          ).to.eql(2); // the auth user is hardcoded to 2 all new items belong to 2
          expect(
            res.body.item_body
          ).to.eql(newItem.item_body);
          expect(
            res.body.item_is
          ).to.eql(newItem.item_is);
          expect(
            res.body
          ).to.have.property('id');
          expect(
            res.headers.location
          ).to.eql(
            `/api/inventory/${res.body.id}`
          );
        })
        .then(postRes =>
          supertest(app)
            .get(
              `/api/inventory/${postRes.body.id}`
            )
            .expect({
              ...postRes.body,
              owner_name: 'Putin'
            })
        );
    });

    const requiredFields = [
      'item_name',
      'item_is',
      'item_list'
    ];

    requiredFields.forEach(field => {
      const newItem = {
        item_name: 'maltese falcon',
        item_is: 'selling',
        item_list: 6
      };

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newItem[field];

        return supertest(app)
          .post('/api/inventory')
          .send(newItem)
          .expect(400, {
            error: {
              message: `Missing '${field}' in request body`
            }
          });
      });
    });

    it('removes XSS attack content from response', () => {
      const maliciousItem = {
        id: 911,
        item_name:
          'Naughty naughty very naughty <script>alert("xss");</script>',
        item_body:
          'Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.',
        item_is: 'selling',
        item_list: 6
      };
      const expectedItem = {
        ...maliciousItem,
        item_name:
          'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;',
        item_body: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
        item_owner: 2,
        owner_name: 'Putin'
      };
      return supertest(app)
        .post('/api/inventory')
        .send(maliciousItem)
        .expect(201)
        .expect(res => {
          expect(
            res.body.item_name
          ).to.eql(
            expectedItem.item_name
          );
          expect(
            res.body.item_body
          ).to.eql(
            expectedItem.item_body
          );
        });
    });
  });

  describe(`DELETE /api/inventory/:item_id`, () => {
    context(`Given no items`, () => {
      it(`responds with 404`, () => {
        const itemId = 123456;
        return supertest(app)
          .delete(
            `/api/inventory/${itemId}`
          )
          .expect(404, {
            error: {
              message: `Item doesn't exist`
            }
          });
      });
    });
    context(
      'Given there are items in the database',
      () => {
        const testItems = makeItemsArray();
        const testUsers = makeUsersArray();
        const testLists = makeListsArray();

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
                      .insert(
                        testItems
                      );
                  });
              });
          }
        );

        it('responds with 204 and removes the item', () => {
          const idToRemove = 5;
          const expectedItems = makeExpectedItems().filter(
            item =>
              item.id !== idToRemove
          );
          return supertest(app)
            .delete(
              `/api/inventory/${idToRemove}`
            )
            .expect(204)
            .then(res =>
              supertest(app)
                .get(`/api/inventory`)
                .expect(expectedItems)
            );
        });
      }
    );
  });

  describe(`PATCH /api/inventory/:item_id`, () => {
    context(`Given no items`, () => {
      it(`responds with 404`, () => {
        const itemId = 123456;
        return supertest(app)
          .patch(
            `/api/inventory/${itemId}`
          )
          .expect(404, {
            error: {
              message: `Item doesn't exist`
            }
          });
      });
    });

    context(
      'Given there are items in the database',
      () => {
        const testItems = makeItemsArray();
        const testUsers = makeUsersArray();
        const testLists = makeListsArray();

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
                      .insert(
                        testItems
                      );
                  });
              });
          }
        );

        it('responds with 204 and updates the item', () => {
          const idToUpdate = 1003;
          const updateItem = {
            item_name:
              'updated item name',
            item_is: 'buying',
            item_body:
              'updated item content'
          };
          const expectedItem = {
            ...makeExpectedItems()[0],
            ...updateItem
          };
          return supertest(app)
            .patch(
              `/api/inventory/${idToUpdate}`
            )
            .send(updateItem)
            .expect(204)
            .then(res =>
              supertest(app)
                .get(
                  `/api/inventory/${idToUpdate}`
                )
                .expect(expectedItem)
            );
        });

        it(`responds with 400 when no required fields supplied`, () => {
          const idToUpdate = 1004;
          return supertest(app)
            .patch(
              `/api/inventory/${idToUpdate}`
            )
            .send({
              irrelevantField: 'foo'
            })
            .expect(400, {
              error: {
                message: `Request body must contain either 'item_name', 'item_body','item_list' or 'item_is'`
              }
            });
        });

        it(`responds with 204 when updating only a subset of fields`, () => {
          const idToUpdate = 1003;
          const updateItem = {
            item_name:
              'updated item title'
          };
          const expectedItem = {
            ...makeExpectedItems()[0],
            ...updateItem
          };

          return supertest(app)
            .patch(
              `/api/inventory/${idToUpdate}`
            )
            .send({
              ...updateItem,
              fieldToIgnore:
                'should not be in GET response'
            })
            .expect(204)
            .then(res =>
              supertest(app)
                .get(
                  `/api/inventory/${idToUpdate}`
                )
                .expect(expectedItem)
            );
        });
      }
    );
  });
});
