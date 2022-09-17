const {Category, Role, User, Product} = require('../models')

const roleValidator = async (role = '') => {
  const existRole = await Role.findOne({ role });

  if (!existRole) {
    throw new Error(`The role ${role} is not register in database`)
  }
};

const emailValidator = async(email = '') => {
  const existEmail = await User.findOne({ email });

  if (existEmail) {
    throw new Error(`The email ${email} already register`)
  }
};

const userValidatorByID = async(id = '') => {
  const existID = await User.findById(id);

  if (!existID) {
    throw new Error('The ID is not valid')
  }
};

const categoryIDExist = async(id = '') => {
  const existID = await Category.findById(id);

  if(!existID) 
    throw new Error ('The id it is already')
};

const productIDExist = async(id = '') => {
  const existID = await Product.findById(id);

  if(!existID) 
    throw new Error ('The id it is already')
};

const collectionAllowed = (collection = '', colAllowed = []) => {

  const existCollection = colAllowed.includes(collection);

  if(!existCollection)
    throw new Error (`This collection ${collection} it's not exist`);

  return true
};

module.exports = {
  roleValidator,
  emailValidator,
  userValidatorByID,
  categoryIDExist,
  productIDExist,
  collectionAllowed
}