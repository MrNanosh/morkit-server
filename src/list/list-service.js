const ListService = {
  getAllLists(knex, auth_user) {
    let lists = knex
      .from('category_list AS li')
      .join(
        'morkit_user AS u',
        'li.list_owner',
        '=',
        'u.id'
      )
      .select(
        'li.*',
        'u.username AS owner_name'
      )
      .where({ list_owner: auth_user });
    return lists;
  },
  insertList(knex, newList) {
    return knex
      .insert(newList)
      .into('category_list')
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },
  getById(knex, id, auth_user) {
    const list = knex
      .from('category_list AS li')
      .join(
        'morkit_user AS u',
        'li.list_owner',
        '=',
        'u.id'
      )
      .select(
        'li.*',
        'u.username AS owner_name'
      )
      .where({ list_owner: auth_user })
      .where('li.id', '=', id)
      .first();

    return list;
  },
  deleteList(knex, id) {
    return knex('category_list')
      .where({ id })
      .delete();
  },
  updateList(knex, id, newListFields) {
    return knex('category_list')
      .where({ id })
      .update(newListFields);
  }
};
module.exports = ListService;
