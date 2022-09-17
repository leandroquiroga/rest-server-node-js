const { Router } = require('express');
const { check } = require('express-validator');

const { categoryIDExist, productIDExist } = require('../utils/db-validators');
const { validationField } = require('../middlewares/validatorError');
const { validatorJWT } = require('../middlewares/validatorJWT');
const { isAdminRole } = require('../middlewares/validatorRole');

const { 
  createProduct, 
  getAllProducts, 
  getProductById, 
  updatedProductById, 
  deleteProductById
} = require('../controllers/product-controller');

const products = Router();

products.get('/', getAllProducts);
products.get('/:id', 
  [
    check('id', 'Product not avialable').isMongoId(),
    check('id').custom(productIDExist),
    validationField
  ] 
  ,getProductById);
products.post('/',
  [
    validatorJWT,
    check('name', 'Plese enter a name').not().isEmpty(),
    validationField
  ]
  ,createProduct
);
products.put('/:id', 
  [
    validatorJWT,
    check('id', 'ID it invalid').isMongoId(),
    check('id').custom(productIDExist),
    validationField
  ],
  updatedProductById
);

products.delete('/:id', 
  [
    validatorJWT,
    isAdminRole,
    check('id', 'ID it invalid').isMongoId(),
    check('id').custom(productIDExist),
    validationField
     
  ],
  deleteProductById
);


module.exports = products