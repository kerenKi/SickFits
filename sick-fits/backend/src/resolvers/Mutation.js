const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
  },
  async signup (parent, args, ctx, info) {
    // Lower case the email
    args.email = args.email.toLowerCase()
    // Hash the password
    const password = await bcrypt.hash(args.password, 10)
    // Create user in the database
    const user = await ctx.db.mutation.createUser({
      data:{
        name: args.name, 
        email: args.email, 
        password,
        permissions: {set:['USER']}
      }
    }, info)
    //Create the JWT token
    const token = jwt.sign({ userId: user.id}, process.env.APP_SECRET)
    //Set jwt on the cookie for the response
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 // 1 day cookie
    })
    // Return the user to the browser
    return user
  },
};

module.exports = Mutations;
