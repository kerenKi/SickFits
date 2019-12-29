const { forwardTo } = require('prisma-binding');
const { hasPermission } = require('../utils');

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
  },
  async  users (parent, args, ctx, info) {
    //1. check if the user is logged in
    if(!ctx.request.userId){
      throw new Error('You must be logged in')
    }
    //2. check if the user has permission to query all the users
    hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE', ])

    //3. if they do - query all the users
    return ctx.db.query.users({}, info)

  }
};

module.exports = Query;
