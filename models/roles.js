const { Schema, model } = require('mongoose');

const RoleSchema = Schema({
  role: {
    type: String,
    required: [true, 'Role it is obligatory ']
  },
});

module.exports = model('role', RoleSchema);