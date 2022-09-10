const path = require('path');
const fs   = require('fs');

const { request, response } = require("express");
const { User, Product } = require("../models");
const uploadedAndValidateFiles = require('../utils/upload-files');


const getUploadFile = async(req = request, res = response) => {
  const {id, collection} = req.params;

  let model; 

  switch(collection){
    case 'users': 
      model = await User.findById(id);

      // Check if not exist a user with that ID
      if(!model)
        return res.status(400).json({
          msg: 'ID invalid'
        });
    break;
    case 'products': 
      model = await Product.findById(id).populate('user', 'name').populate('category', 'name');
      
      // Check if not exist a product with that ID
      if(!model)
      return res.status(400).json({
        msg: 'Model invalid'
      });
    break;
    
    default: 
      return res.status(500).json({
        msg: 'Please! Validate the collection'
      });
  };

  if(model.picture){
    const pathImg = path.join(__dirname, '../uploads', collection, model.picture);

    // Return the path of the image
    if(fs.existsSync(pathImg)) return res.sendFile(pathImg)
    
  };  

  // Make path of image not available
  const pathImg = path.join(__dirname, '../assets/no-image.jpg');
  res.status(400).sendFile(pathImg);
  
};

const uploadFile = async(req = request, res = response) => {

  try {
     const nameFile = await uploadedAndValidateFiles(req.files);
      res.status(200).json(nameFile);

  } catch (msg) {
    res.status(400).json(msg);
  };
};

const updateFile = async(req = request, res = response) => {

  const {id, collection} = req.params; 
  let model; 

  switch(collection){
    case 'users': 
      model = await User.findById(id);

      // Check if not exist a user with that ID
      if(!model)
        return res.status(400).json({
          msg: 'ID invalid'
        });
    break;
    case 'products': 
      model = await Product.findById(id).populate('user', 'name').populate('category', 'name');
      
      // Check if not exist a product with that ID
      if(!model)
      return res.status(400).json({
        msg: 'Model invalid'
      });
    break;
    
    default: 
      return res.status(500).json({
        msg: 'Please! Validate the collection'
      });
  };

  if(model.picture){
    const pathImg = path.join(__dirname, '../uploads', collection, model.picture);

    if(fs.existsSync(pathImg)){
      fs.unlinkSync(pathImg)
    }
  };

  const name = await uploadedAndValidateFiles(req.files, collection); 
  model.picture = name

  model.save();

  res.status(200).json({
    msg: 'OK',
    id,
    collection,
  });
};

module.exports = {
  uploadFile,
  updateFile,
  getUploadFile,
}