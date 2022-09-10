const { response, request } = require("express");
const { Category } = require('../models');

const getCategories = async(req = request, res = response) => {

  // limit and from 
  const { limit = 10, from = 0 } = req.query;
  
  const [categories, total] = await Promise.all([
    Category.find({state: true})
            .populate('users', 'name')
            .skip(Number(from))
            .limit(Number(limit)),
    Category.countDocuments({state: true})
  ])
   
  res.status(200).json({
    msg: 'GET - Categories',
    categories,
    total
  });
};

const getCategoryByID = async(req = request, res = response) => {
  const {id} = req.params;
  
  try {
    const category = await Category.findById(id)
                                   .populate('users', 'name');
    if(!category.state)
      return res.status(400).json({
        msg: 'Sorry! Category invalid'
      });
    
    res.status(200).json({
      msg: 'GET - Category',
      category
    });    
  } catch (error) {
    return res.status(500).json({
      msg: 'Error! Please contact with administrator'
    })
  }
};

const addCategory = async(req = request, res = response) => {
  
  const name = req.body.name.toUpperCase();

  try {
    const categoryDB = await Category.findOne({name});
    
    if(categoryDB){
      res.status(400).json({
        msg: `The category ${categoryDB.name} is exist`
      });      
    }
    // Ganerate the data 
    const data = {
      name, 
      user: req.user._id
    }

    const category = new Category(data);
    await category.save();
    
    res.status(201).json({
      msg: 'Has been created a new category',
      category
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: 'Please! Contact with administrator'
    })  
  }

};

const updateCategory = async(req = request, res = response) => {
  const {id} = req.params;
  const {state, users, ...data} = req.body;

  data.name = data.name.toUpperCase();
  // data.user = req.user;

  try {
    const category =  await Category.findById(id);

    // console.log(data.name, category);
    if(category.name === data.name)
      return res.status(400).json({
        msg: 'The name it is already in the database, please enter other again !'
      });

    const categoryNameChanged = await Category.findByIdAndUpdate(id, {new: true} ,{name: data.name});

    
    res.status(200).json({
      msg: 'PUT - Category',
      categoryNameChanged
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Error! Please contact with administrator'
    })
  }
};

const deleteCategory = async(req = request, res = response) => {
  const {id} = req.params;

  try {
    const categoryStateChanged = await Category.findByIdAndUpdate(id, {state: false})
    res.status(200).json({
      msg: 'DELETE - Categories',
      categoryStateChanged
    });
  } catch (error) {
    console.log(error); 
    res.status(500).json({
      msg: 'Error! Please contact with administrator'
    });
  }
}

module.exports = {
  getCategories,
  getCategoryByID,
  addCategory,
  updateCategory,
  deleteCategory
}