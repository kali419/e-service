const jwt = require('jsonwebtoken');
const User = require('../schema/User');
const serviceProvider = require('../schema/serviceProvider');

const secretKey = 'chris north secret'; 

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt; 
  if (token) {
    jwt.verify(token, secretKey, (err, decodedToken) => {
      if (err) {

        res.redirect('/login'); 
      } else {
        req.user = decodedToken;
        next(); 
      }
    });
  } else {
    res.redirect('/login');
  }
};
 

// check current user
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  
  if (token) {
    jwt.verify(token, 'chris north secret', async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });

  } else {
    res.locals.user = null;
    next();
  }
};





module.exports = { requireAuth, checkUser };

