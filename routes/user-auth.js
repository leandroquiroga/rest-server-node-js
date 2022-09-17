const {Router} = require('express');
const {check} = require('express-validator');

const { authLogin, googleSignIn } = require('../controllers/auth-controllers');
const { validationField } = require('../middlewares/validatorError');


const auth = Router();

auth.post('/login', 
  [
    check('email', 'Email is requerid').isEmail(),
    check('password', 'Password is requerid').not().isEmpty(),
    validationField
  ],
  authLogin
);


auth.post('/google', 
  [
    check('id_token', 'ID Token is requerud').not().isEmpty(),
    validationField,
  ],
  googleSignIn
)



module.exports = auth;