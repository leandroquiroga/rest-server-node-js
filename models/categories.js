const { Schema, model } = require("mongoose");

const CategoriesSchema = Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    unique: true
  },

  state: {
    type: Boolean,
    default: true,
    required: true,
  },

  user:{ 
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },


});
CategoriesSchema.method('toJSON', function() {
  const {__v, state, ...category} = this.toObject();
  return category;
});

module.exports = model('category', CategoriesSchema)