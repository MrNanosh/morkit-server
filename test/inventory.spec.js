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
    context(
      'Given no inventory',
      () => {
        it('responds with 200 and an empty list', () => {
          return supertest(app)
            .get('/api/inventory')
            .expect(200, []);
        });
      }
    );

    context(
      'Given there are items in the inventory',
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

        it('GET /api/inventory responds with 200 and part of the inventory for authorized user', () => {
          const expectedItems = makeExpectedItems().filter(
            item =>
              Number(
                item.item_owner
              ) === 2
          );
          return supertest(app)
            .get('/api/inventory')
            .expect(200, expectedItems);
        });
      }
    );

    context(
      `Given an XSS attack inventory item`,
      () => {
        const maliciousItem = {
          id: 911,
          item_name:
            'Naughty naughty very naughty <script>alert("xss");</script>',
          item_is: 'selling',
          item_body:
            'Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.',
          item_list: 1000,
          item_owner: 2
        };
        const expectedItem = {
          ...maliciousItem,
          item_name:
            'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;',
          item_body: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
        };
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
                        maliciousItem
                      );
                  });
              });
          }
        );

        it('removes XSS attack content', () => {
          return supertest(app)
            .get(`/api/inventory`)
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

  describe('GET /api/inventory/:item_id', () => {
    context(
      'Given no inventory',
      () => {
        it('responds with 404', () => {
          const itemId = 123456;
          return supertest(app)
            .get(
              `/api/inventory/${itemId}`
            )
            .expect(404, {
              error: {
                message:
                  "Item doesn't exist"
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
            const maliciousItem = {
              id: 911,
              item_name:
                'Naughty naughty very naughty <script>alert("xss");</script>',
              item_is: 'selling',
              item_body:
                'Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.',
              item_list: 1000,
              item_owner: 2
            };

            beforeEach(
              'insert inventory',
              () => {
                return db
                  .into('inventory')
                  .insert(
                    maliciousItem
                  );
              }
            );

            it('removes XSS attack content', () => {
              return supertest(app)
                .get(
                  `/api/inventory/${maliciousItem.id}`
                )
                .expect(200)
                .expect(res => {
                  expect(
                    res.body.item_name
                  ).to.eql(
                    'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;'
                  );
                  expect(
                    res.body.item_body
                  ).to.eql(
                    'Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.'
                  );
                });
            });
          }
        );
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
                      .insert(
                        testItems
                      );
                  });
              });
          }
        );

        it('responds with 200 and the specified item', () => {
          const itemId = 1003;
          const expectedItem = makeExpectedItems()[0];
          return supertest(app)
            .get(
              `/api/inventory/${itemId}`
            )
            .expect(200, expectedItem);
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

  describe.only(`DELETE /api/inventory/:item_id`, () => {
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
        beforeEach(
          'insert items',
          () => {
            return db
              .into('blogful_users')
              .insert(testUsers)
              .then(() => {
                return db
                  .into('inventory')
                  .insert(testItems);
              });
          }
        );

        it('responds with 204 and removes the item', () => {
          const idToRemove = 2;
          const expectedItems = testItems.filter(
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
        beforeEach(
          'insert items',
          () => {
            return db
              .into('blogful_users')
              .insert(testUsers)
              .then(() => {
                return db
                  .into('inventory')
                  .insert(testItems);
              });
          }
        );

        it('responds with 204 and updates the item', () => {
          const idToUpdate = 2;
          const updateItem = {
            title: 'updated item title',
            style: 'Interview',
            content:
              'updated item content'
          };
          const expectedItem = {
            ...testItems[
              idToUpdate - 1
            ],
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
          const idToUpdate = 2;
          return supertest(app)
            .patch(
              `/api/inventory/${idToUpdate}`
            )
            .send({
              irrelevantField: 'foo'
            })
            .expect(400, {
              error: {
                message: `Request body must contain either 'title', 'style' or 'content'`
              }
            });
        });

        it(`responds with 204 when updating only a subset of fields`, () => {
          const idToUpdate = 2;
          const updateItem = {
            title: 'updated item title'
          };
          const expectedItem = {
            ...testItems[
              idToUpdate - 1
            ],
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
