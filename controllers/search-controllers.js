const {request, response} = require('express');
const {ObjectId} = require('mongoose').Types;

const { User, Category, Product } = require('../models');
const collectionAllow = [
  'users',
  'categories',
  'products',
  'rols'
];

const searchUsers = async(term = '', res = response) => {

  // Check if a temr is mongoID;
  const isMongoID = ObjectId.isValid(term);

  if(isMongoID) {
    const user = await User.findById(term);
    return res.status(200).json({
      result: (user) ? [user] : []
    });
  }
  
  //Expresion Regular
  const termExpReg = new RegExp(term, 'i');

  const [users, total] = await Promise.all([
    // Search a user active by name or email 
    User.find({
      $or: [ {name: termExpReg}, {email: termExpReg}],
      $and:[{state: true}]
    }),
    
    // Search total user active by name or email 
    User.countDocuments({
      $or: [ {name: termExpReg}, {email: termExpReg}],
      $and:[{state: true}]
    })
  ]);

  if(users.length > 0 && total > 0){
    return res.status(200).json({
      results: users,
      total
    });  
  };
  
  return res.status(200).json({
    msg: `Could not be found ${term} in our database`,
    total
  })  
};


const searchCategories = async(term = '', res = response) => {

  // Check if a temr is mongoID;
  const isMongoID = ObjectId.isValid(term);

  if(isMongoID) {
    const category = await Category.findById(term);
    return res.status(200).json({
      result: (category) ? [category] : []
    });
  };

  //Expresion Regular
  const termExpReg = new RegExp(term.toLocaleUpperCase(), 'i');

  // Search category and return total of products searched
  const [categories, total] = await Promise.all([
    Category.find({name: termExpReg, state: true}),
    Category.countDocuments({name: termExpReg,  state: true}),
  ]);

  if(categories.length > 0 && total > 0){
    return res.status(200).json({
      results: categories,
      total
    });  
  };
  
  return res.status(200).json({
    msg: `Could not be found ${term} in our database`,
    total
  })  
};

const searchProducts = async(term = '', res = response) => {
  // Check if a term is mongoID; 
  const isMongo = ObjectId.isValid(term);

  if(isMongo) {
    const product = await Product.findById(term)
                                 .populate('category', 'name');
    return res.status(200).json({
      result: (product) ? [product] : []
    });
  };

  const termExpReg = new RegExp(term.toLocaleUpperCase(), 'i');
  
  // Search product and return total of products searched
  const [products, total] = await Promise.all([
    Product.find({name: termExpReg, state: true})
           .populate('category', 'name'),
    Product.countDocuments({name: termExpReg, state: true}),
  ]);

  if(products.length > 0 && total > 0){
    return res.status(200).json({
      results: products,
      total
    });  
  };
  
  return res.status(200).json({
    msg: `Could not be found ${term} in our database`,
    total
  })  

};
const searchCollection = async(req = request, res = response) => {

  const { collection, any } = req.params;

  // If not exist the collection return a status 400
  if( !collectionAllow.includes(collection) )
    return res.status(400).json({
      msg: `The collection ${collection} doesn't exist`
    });
  
  switch(collection){
    case 'users':
      searchUsers(any, res);
      break;
    case 'categories': 
      searchCategories(any, res);
      breakñ
    case 'products': 
      searchProducts(any, res)
      break;
    default:
      res.status(400).json({
        msg: 'It should make at least an search'
      })
  }

};

module.exports = {
  searchCollection,
}