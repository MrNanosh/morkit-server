const ItemsService = {
  getAllItems(knex, auth_user) {
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
      )
      .where({ item_owner: auth_user });
    return items;
  },
  insertItem(knex, newItem) {
    return knex
      .insert(newItem)
      .into('inventory')
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },
  getById(knex, id, auth_user) {
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
      )
      .where({ item_owner: auth_user })
      .where('i.id', id)
      .first();
    return items;
  },
  deleteItems(knex, id) {
    return knex('inventory')
      .where({ id })
      .delete();
  },
  updateItem(knex, id, newItemFields) {
    return knex('inventory')
      .where({ id })
      .update(newItemFields);
  }
};
module.exports = ItemsService;
