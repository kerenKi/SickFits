const Mutations = {
  async createItem (parent, args, ctx, info) {
    //TODO check if user is logged in
    
    //ctx.db access the db (we set it up in createServer.js)
    const item = await ctx.db.mutation.createItem({
      data: {
        //spreading the args object instead of copying all the fields separately 
        ...args
      }
    }, info)

    return item
  }
};

module.exports = Mutations;
