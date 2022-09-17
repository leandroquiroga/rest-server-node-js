const {Router} = require('express');
const {check} = require('express-validator');

const { validationField } = require('../middlewares/validatorError');
const { validatorJWT } = require('../middlewares/validatorJWT');
const { categoryIDExist } = require('../utils/db-validators');

const { getCategories, 
        getCategoryByID, 
        addCategory, 
        updateCategory, 
        deleteCategory 
      } = require('../controllers/categories-controllers');
const { isAdminRole } = require('../middlewares/validatorRole');

const categories = Router();

// Get all categories - public
categories.get('/', getCategories );

// Get one category by id - public
categories.get('/:id',
  [
    check('id', 'ID Invalid').isMongoId(),
    check('id').custom(categoryIDExist),
    validationField
  ],
  getCategoryByID 
);

// Add a new category - private 
categories.post('/', 
  [
    validatorJWT,
    check('name', 'Please enter a name').not().isEmpty(),
    validationField,
  ], 
  addCategory
);

// Update a category
categories.put('/:id', 
  [
    validatorJWT,
    check('id', 'ID Invalid').isMongoId(),
    check('id').custom(categoryIDExist),
    validationField
  ],
  updateCategory 
);

// Delete a category
categories.delete('/:id', 
  [
    validatorJWT,
    isAdminRole,
    check('id', 'ID Invalid').isMongoId(),
    check('id').custom(categoryIDExist),
    validationField
  ],
  deleteCategory 
);
module.exports = categories;