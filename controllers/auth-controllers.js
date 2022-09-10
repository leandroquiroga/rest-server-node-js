const {request, response, json} = require('express');
const bcryptjs = require('bcryptjs');

const User = require('./../models/users');
const { generatorToken } = require('../utils/genratorJWT');
const { googleVerify } = require('../utils/google-verify');

const authLogin = async(req = request, res = response) => {
  const {email, password} = req.body;
  
  try {
    // verific if user exist
    const user = await User.findOne({email});
    
    if(!user){
      return res.status(400).json({
        msg: 'Email invalid'
      })
    }
    // verific if user is active
    if(!user.state){
      return res.status(400).json({
        msg: 'Your user it is inactive'
      })
    }
    // verifiv password
    const validPassword = bcryptjs.compareSync(password, user.password);
    if(!validPassword){
      return res.status(400).json({
        msg: 'Password do to match'
      })
    };
    // generate JWT
    const token = await generatorToken(user.id);
    
    res.status(200).json({
        msg: 'Welcome',
        user, 
        token
    });
  } catch (error) {
      console.log(error);
      return res.status(500).json({
          msg: 'Server Error ! Please contact with administrator'
      })
  };    
};


const googleSignIn = async(req = request, res = response) => {

  try {
    const {id_token } = req.body;

    // Destructuring the info of the user with authentication googleSingIn;
    const {email, name, picture} = await googleVerify(id_token);
    // console.log(googleUser);

    // Search the user in the database
    let user = await User.findOne({email});


    // Create the user
    if(!user){
      const data = {
        name,
        email,
        // password: '123456',
        picture,
        state: true,
        googleSingUp: true,
        role: 'ADMIN_ROLE'
      };

      user = new User(data);
      await user.save();
    };

    // Check the state of the user 
    if(!user.state)
      res.status(400).json({
        msg: 'User inactive, please contact with administrator'
      });

    // Generate JWT
    const token = await generatorToken(user.id);

    return res.status(200).json({
      user,
      token
    });
    
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: 'Token no valid'
    })
  };
};

module.exports = {
    authLogin,
    googleSignIn,
}