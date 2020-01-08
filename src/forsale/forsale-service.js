const ForsaleService = {
  getAllItems(knex) {
    let items = knex
      .from('inventory AS i')
      .join(
        'morkit_user as u',
        'i.item_owner',
        '=',
        'u.id'
      )
      .select(
        'i.*',
        'u.username AS owner_name'
      );
    return items;
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
