const {Router} = require('express');
const { check } = require('express-validator');

const { searchCollection } = require('../controllers/search-controllers');
const { validationField } = require('../middlewares/validatorError');


const search = Router();

search.get('/:collection/:any', searchCollection);

module.exports = search;