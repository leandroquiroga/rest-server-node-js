const { request, response } = require('express');
const { validationResult } = require('express-validator');

const validationField = (req = request, res = response, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json(errors);
  };

  next();
};

const validatorFile = (req = request, res = response, next) => {
    // If it isn't files and void
    if(!req.files || Object.keys(req.files).length === 0 || !req.files.file) 
      return res.status(400).json({
        msg: 'No file were uploaded'
      });

    next()
}

module.exports = {
  validationField,
  validatorFile,
}