const { forwardTo } = require('prisma-binding');

const Query = {
  //forward the Api straight to the db. good for simple cases without authentication and such
  items: forwardTo('db'),
  item: forwardTo('db'),
  itemsConnection: forwardTo('db'),
  me (parent, args, ctx, info) {
    //check if there is a current user id
    if (!ctx.request.userId) {
      return null
    }
    return ctx.db.query.user({
      where: { id: ctx.request.userId}
    }, info)
  }
};

module.exports = Query;
