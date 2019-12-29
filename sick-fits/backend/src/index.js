const cookieParser = require('cookie-parser');
require('dotenv').config({ path: 'variables.env' });
const createServer = require('./createServer');
const jwt = require('jsonwebtoken');
const db = require('./db');

const server = createServer();

// Use express middleware to handle cookies (JWT)
server.express.use(cookieParser());

//Decode the jwt for the user id
server.express.use((req, res, next) => {
  const { token } = req.cookies
  if(token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET)
    req.userId = userId
  }
  next()
});

// TODO Use express middleware to populate current user on each request
server.express.use(async (req, res, next) => {
  const { userId } = req
  //if the user is not logged in just continue
  if(!userId) {
    return next()
  }
  db.query.user(
    { where: { id: userId }},
    '{ id, name, email, permissions }'
    ).then( user => {
      console.log('user:', user)
      req.user = user
      console.log('req:', req)
      next()
    })
    .catch(error => {
      console.log('error:', error)
    })
});




server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL,
    },
  },
  deets => {
    console.log(`Server is now running on port http:/localhost:${deets.port}`);
  }
);