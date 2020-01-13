const MessagesService = {
  getAllMessages(knex) {
    return knex
      .from('msg')
      .join(
        'inventory as i',
        'i.id',
        '=',
        'msg.item_id'
      )
      .join(
        'morkit_user as ur',
        'ur.id',
        '=',
        'msg.receiver_id'
      )
      .join(
        'morkit_user as us',
        'us.id',
        '=',
        'msg.sender_id'
      )
      .select(
        'msg.*',
        'i.item_name as item_name',
        'us.username as sender_name',
        'us.fullname as sender_fullname',
        'ur.username as receiver_name',
        'ur.fullname as receiver_fullname'
      );
  },
  insertMessage(knex, newItem) {
    return knex
      .insert(newItem)
      .into('msg')
      .returning('*')
      .then(rows => {
        return this.getById(
          knex,
          rows[0].id
        );
      });
  },
  getById(knex, id) {
    return knex
      .from('msg')
      .join(
        'inventory as i',
        'i.id',
        '=',
        'msg.item_id'
      )
      .join(
        'morkit_user as ur',
        'ur.id',
        '=',
        'msg.receiver_id'
      )
      .join(
        'morkit_user as us',
        'us.id',
        '=',
        'msg.sender_id'
      )
      .select(
        'msg.*',
        'i.item_name as item_name',
        'us.username as sender_name',
        'us.fullname as sender_fullname',
        'ur.username as receiver_name',
        'ur.fullname as receiver_fullname'
      )
      .where('msg.id', id)
      .first();
  },
  deleteMessage(knex, id) {
    return knex('msg')
      .where({ id })
      .delete();
  },
  updateMessage(
    knex,
    id,
    newMessageFields
  ) {
    return knex('msg')
      .where({ id })
      .update(newMessageFields);
  }
};
module.exports = MessagesService;
