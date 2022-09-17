const { response, request} = require('express');
const jwt = require('jsonwebtoken');

const User = require('../models/users');

const validatorJWT = async(req = request, res = response, next) => {

  // x-token headers 
  const token = req.header('x-token');

  // verific if token exist
  if(!token) 
    return res.status(401).json({
      msg: 'You are haven not token',
    });

    try {
      // extract the information of the user and check your it's JWT
      const {uid} = jwt.verify(token, process.env.SECRET_JWT_SEED);
      
      // Read the user by uid  and modifies the request for send through reference of the next
      const user = await User.findById(uid);


      if(!user) 
        return res.status(401).json({
          msg: 'User not exists, please signUp'
        })
      // Verific if state it's false return a status 401
      if(!user.state)
       return res.status(401).json({
         msg: 'Token not valid, no authorized'
       })
      
      req.user = user;
       
      next();
    } catch (error) {
      return res.status(401).json({
        msg: 'Token invalid'
      });
    };
};

module.exports = {
  validatorJWT,
}