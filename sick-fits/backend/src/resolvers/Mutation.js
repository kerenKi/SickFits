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
  },

  async updateItem (parent, args, ctx, info) {
    // make a copy of the updates
    const updates = {...args}
    //remove the id so we don't update it
    delete updates.id
    //run the update method
    return ctx.db.mutation.updateItem({
      data: updates,
      where: {
        id: args.id
      }
    }, info) 
  },

  async deleteItem (parent, args, ctx, info) {
    const where = { id: args.id }
    // 1. find the item
    const item = await ctx.db.query.item({where}, `{id title}`)
    // 2. check for permission - if they own it or admin that has permission
    //TODO
    // 3. delete the item
    return ctx.db.mutation.deleteItem({ where }, info)
  }
};

module.exports = Mutations;
