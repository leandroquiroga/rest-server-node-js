const {request, response} = require('express');

const {Product, Category} = require('../models');

const getAllProducts = async( req = request, res = response) => {
  
  const {limit = 10, from = 0} = req.query;

  const [products, total] = await Promise.all([
    Product.find({state: true})
            .populate('user', 'name')
            .populate('category', 'name')
            .skip(Number(from))
            .limit(Number(limit)),
    Product.countDocuments({state: true})
  ]);

  res.status(200).json({
    products,
    total
  });
};

const getProductById = async(req = request, res = response) => {
  const {id} = req.params;

  try {

    const productDB = await Product.findById(id)
                                   .populate('user', 'name')
                                   .populate('category', 'name')

    if(!productDB) 
      return res.status(400).json({
        msg: 'Product invalid'
      });
    
    res.status(200).json(productDB);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Error! Please contact with administrator'
    })
  }
};

const createProduct = async(req = request, res = response) => {

  const {name, price, avialable, description} = req.body;
  
  const category = req.body.category.toUpperCase();
  
  try { 
    
    const categoryDB = await Category.findOne({name: category});
    const productDB = await Product.findOne({name});

    // Check if exist category    
    if(!categoryDB)
      return res.status(400).json({
        msg: 'Category Invalid'
      });
    
    // Check if the name it exist in the database
    if(productDB){
      if(productDB.name === name)
        return res.status(400).json({
          msg: 'Product already'
        })
    }
    // Create data
    const data = {
      avialable,
      description,
      category: categoryDB._id,
      name,
      price,
      user: req.user._id
    }
      
     const product = new Product(data);
     // Save data
     product.save();

     res.status(201).json({
      msg: 'Product Created Success',
      product,
     });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: 'Error! Please contact with administrator'
    })    
  }

};

const updatedProductById = async(req = request, res = response) => {

  const { id } = req.params;
  const {state, user, category, ...data} = req.body;

  try {
    const product = await Product.findById(id);

    //Check if name it's equal 
    if(data.name === product.name)
      return res.status(400).json({
        msg: 'The name it is already in the database, please enter other again !'
      });
    
    //Check if description it empty
    if(data.description === '') 
      return res.status(400).json({
        msg: 'Description is empty, please enter any description !'
      });

    // Updated product
    const updatedProduct = await Product.findByIdAndUpdate(id,{new: true}, data);

    res.status(200).json({
      msg: 'Product updated',
      updatedProduct
    });

  } catch (error) {
    res.status(500).json({
       msg: 'Error! Please contact with administrator'
    }) 
  }
};

const deleteProductById = async(req = request, res = response) => {
  const { id } = req.params; 

  try {
    const updatedProductState = await Product.findByIdAndUpdate(id, {state: false});

    res.status(200).json({
      msg: 'Product deleted',
      updatedProductState
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Error! Please contact with administrator'
    });
  }
};


module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updatedProductById,
  deleteProductById
}