const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();

const {
  userDelete,
  userIdex,
  userPatch,
  userPost,
  userPut
} = require('../controllers/user-controllers');
const { roleValidator, emailValidator, userValidatorByID } = require('../helpers/db-validators');
const { validatorJWT } = require('../middlewares/validatorJWT');
const { validationField } = require('../middlewares/validatorError');
const { isAdminRole, haveRole } = require('../middlewares/validatorRole');


router.get('/', userIdex);
router.post('/',
  [
    check('name', 'Please enter a name, is requerid').not().isEmpty().isLength({ min: 3 }),
    check('email', 'Email invalid! Please verific your email').isEmail(),
    check('email').custom(emailValidator),
    check('password', 'Please enter a password greatest a 6 characters').isLength({ min: 6 }),
    // check('role', 'Please enter your role correct').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('role').custom(roleValidator),
    validationField
  ],
  userPost);
router.put('/:id',
  [
    check('id', 'ID invalid').isMongoId(),
    check('id').custom(userValidatorByID),
  ],
  validationField,
  userPut);

router.delete('/:id',
  validatorJWT,
  isAdminRole,
  haveRole('ADMIN_ROLE'),
  [
    check('id', 'ID invalid').isMongoId(),
    check('id').custom(userValidatorByID),
    validationField
  ]
  ,userDelete);
router.patch('/', userPatch);

module.exports = router;