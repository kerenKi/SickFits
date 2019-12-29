const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');
const { promisify } = require('util');
const {transport, makeANiceEmail } = require('../mail');
const { hasPermission } = require('../utils');


const Mutations = {

  async createItem (parent, args, ctx, info) {
    // check if user is logged in
    if(!ctx.request.userId) {
      throw new Error(`You must be logged in to do that!`)
    }
    //ctx.db access the db (we set it up in createServer.js)
    const item = await ctx.db.mutation.createItem({
      data: {
        //Creating a relationship between the Item and the User
        user: {
          connect: {
            id: ctx.request.userId
          }
        },
        //Spreading the args object instead of copying all the fields separately
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

  async requestReset (parent, args, ctx, info) {
    //1. check if this is a real user
    const user = await ctx.db.query.user({where: { email: args.email}})
    if(!user) {
      throw new Error(`There is no user with the email ${args.email}`)
    }
    //2. set a reset token and expiry for the user
    const randomBytesPromiseified = promisify(randomBytes)
    const resetToken = (await randomBytesPromiseified(20)).toString('hex')
    const resetTokenExpiry = Date.now() + 3600000 //1 hour expiry
    //update the user with the token and the expiry
    const res = await ctx.db.mutation.updateUser({
      where: { email: args.email},
      data: {
        resetToken,
        resetTokenExpiry
      }
    })
    console.log(res)
    //3. email reset token
    const mailRes = await transport.sendMail({
      from: 'wes@wesbos.com',
      to: user.email,
      subject: 'Your Password Reset Token',
      html: makeANiceEmail(`Your Password Reset Token is here!
      \n\n
      <a href="${process.env
        .FRONTEND_URL}/reset?resetToken=${resetToken}">Click Here to Reset</a>`),
    });
    //4. return a message
    return {message:'tnx'}

  },

  async resetPassword (parent, args, ctx, info) {
    //1. check if the password match
    if (args.password !== args.confirmPassword){
      throw new Error('Passwords don\'t match')
    }
    //2. check if token is legit
    //3. check if token not expired
    const [user] = await ctx.db.query.users({
      where: {
        resetToken: args.resetToken,
        resetTokenExpiry_gte: (Date.now() - 3600000),
      }
    })
    if (!user) {
      throw new Error('This token is either invalid or expired')
    }
    //4. hash new password
    const password = await bcrypt.hash(args.password, 10)
    //5. save new password to user and remove resetToken fields
    const updatedUser = await ctx.db.mutation.updateUser({
      where: { email: user.email },
      data: {
        password,
        resetToken: null,
        resetTokenExpiry: null
      }

    })
    //6. generate jwt
    const token = jwt.sign({ userId: updatedUser.id}, process.env.APP_SECRET)
    //7. set jwt in a cookie
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week cookie
    })
    //8. return new user
    return updatedUser
  },

  async updatePermissions (parent, args, ctx, info) {
    const { userId } = ctx.request
    //1. check if user logged in
    if(!userId) {
      throw new Error(`You must be logged in to do that!`)
    }
    //2. query current user
    const user = await ctx.db.query.user({ where: {id: userId}}, info)
    if(!user) {
      throw new Error(`There is no user with the id ${userId}`)
    }
    //3. check for permission to do that
    hasPermission(user, ['ADMIN', 'PERMISSIONUPDATE'])
    //4. update the permissions
    return ctx.db.mutation.updatePermissions({
      data: {
        id: user.id,
        permissions: {
          set: args.permissions
        }
      },
      where: {
        id: args.userId
      }
    }, info)
  },
};

module.exports = Mutations;
