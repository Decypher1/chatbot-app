const session = require('express-session');

const sessionMiddleware = session({
    secret: process.env.sessionSecret,
    resave: false,
    saveUninitialized: false
  });
  
  app.use(sessionMiddleware);