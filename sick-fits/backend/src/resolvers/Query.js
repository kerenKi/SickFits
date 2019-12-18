const { forwardTo } = require('prisma-binding');

const Query = {
  //forward the Api straight to the db. good for simple cases without authentication and such
  items: forwardTo('db')
  // async items (parent, args, ctx, info) {
  //   const items = await ctx.db.query.items()
  //   return items
  // }
};

module.exports = Query;
