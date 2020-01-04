const ArticlesService = {
  getAllArticles(knex) {
    return knex
      .select('*')
      .from('inventory');
  },
  insertArticle(knex, newItem) {
    return knex
      .insert(newItem)
      .into('inventory')
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },
  getById(knex, id) {
    return knex
      .from('inventory')
      .select('*')
      .where('id', id)
      .first();
  },
  deleteArticle(knex, id) {
    return knex('inventory')
      .where({ id })
      .delete();
  },
  updateArticle(
    knex,
    id,
    newArticleFields
  ) {
    return knex('inventory')
      .where({ id })
      .update(newArticleFields);
  }
};
module.exports = ForsaleService;
