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
      maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week cookie
    })
    // Return the user to the browser
    return user
  },

  async signin (parent, { email, password }, ctx, info) {
    //1. check if there is a user with that email
      const user = await ctx.db.query.user({ where: {email} })
      if(!user) {
        throw new Error(`There is no user with the email ${email}`)
      }
    //2. check if the password is correct
      const valid = await bcrypt.compare(password, user.password)
      if(!valid) {
        throw new Error(`Invalid password`)
      }
    //3. generate a jwt
    const token = jwt.sign({ userId: user.id}, process.env.APP_SECRET)
    //4. set a cookie with the token
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week cookie
    })
    //5. return the user 
    return user
  },
  async signout (parent, args, ctx, info) {
    ctx.response.clearCookie('token')
    return { message: 'User logged out'}
  },
};

module.exports = Mutations;
