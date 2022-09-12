const {Schema, model} = require('mongoose');


const ProductSchema = Schema({
  name: {
    type: String,
    required: [true, 'The names of product it is required'],
  },

  state: {
    type: Boolean,
    default: true,
    required: true,  
  },

  category: {
    type: Schema.Types.ObjectId,
    ref: 'category',
    required: true,
  },

  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  description: {
    type: String
  },

  available: {
    type: Boolean,
    default: true
  },

  price: {
    type: Number,
    default: 0,
  },

  picture: {
    type: String,
  },

});

ProductSchema.method('toJson', function(){
  const {__v, state ,...info} =  this.toObject();
  return info;
});

module.exports = model('product', ProductSchema)