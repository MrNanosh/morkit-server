const ForsaleService = {
  getAllItems(knex) {
    return knex
      .select('*')
      .from('inventory'); //do a join to give not only id of item_owner but details about that owner
  },
  // insertItem(knex, newItem) {
  //   return knex
  //     .insert(newItem)
  //     .into('inventory')
  //     .returning('*')
  //     .then(rows => {
  //       return rows[0];
  //     });
  // },
  getById(knex, id) {
    return knex
      .from('inventory')
      .select('*')
      .where('id', id)
      .first();
  }
  // deleteItem(knex, id) {
  //   return knex('inventory')
  //     .where({ id })
  //     .delete();
  // },
  // updateItem(knex, id, newItemFields) {
  //   return knex('inventory')
  //     .where({ id })
  //     .update(newItemFields);
  // }
};
module.exports = ForsaleService;
