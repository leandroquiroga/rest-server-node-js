const {Router} = require('express');
const {check} = require('express-validator');

const {validationField, validatorFile} = require('../middlewares/validatorError');
const { uploadFile, updateFile, getUploadFile } = require('../controllers/uploads-controllers');
const {collectionAllowed} = require('../utils/db-validators')

const uploads = Router();

uploads.get('/:collection/:id',
  [
    check('id', 'ID Invalid').isMongoId(),
    check('collection').custom(c => collectionAllowed(c, ['users', 'products'] )),
    validationField,
  ], 
  getUploadFile
);
uploads.post('/', validatorFile ,uploadFile);
uploads.put('/:collection/:id', 
  validatorFile,
  [
    check('id', 'ID Invalid').isMongoId(),
    check('collection').custom(c => collectionAllowed(c, ['users', 'products'] )),
    validationField,
  ],
  updateFile
);

module.exports = uploads;