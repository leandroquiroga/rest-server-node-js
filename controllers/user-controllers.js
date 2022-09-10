const { request, response } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('./../models/users');

const userIdex = async (req = request, res = response) => {
  
  // Limit by default = 5 and from = 0
  const { limit = 5, from = 0 } = req.query;

  const [total, users] = await Promise.all([
    User.countDocuments({ state: true }),
    User.find({ state: true })
        .skip(Number(from))
        .limit(Number(limit))
  ]);
  res.json({total, users});
}
const userPost = async (req = request, res = response) => {
  
  const { name, email, role, password } = req.body;
  const user = new User({ name, email, role, password });  

  // Encrypt password
  const salt = bcryptjs.genSaltSync();
  user.password = bcryptjs.hashSync(password, salt);

  // Save database
  try {
    await user.save();
    res.status(201).json({ user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: 'Sorry! Has not been a created a new user'
    });
  }
}
const userPut = async(req = request, res = response) => {
  const { id } = req.params;
  const {_id, password, googleSingUp, ...rest } = req.body;

  
  // Validate with database
  if (password) {
    // Encrypt password
    const salt = bcryptjs.genSaltSync();
    rest.password = bcryptjs.hashSync(password, salt);
  };

  const user = await User.findByIdAndUpdate(id, rest);
  

  res.json({user})
}
const userPatch =(req = request, res = response) => {
  res.json({ mesagge: 'User' })
}
const userDelete = async(req = request, res = response) => {
  const { id } = req.params;

  // Update state
  const user = await User.findByIdAndUpdate(id, {state: false})
  res.json(user);
}

module.exports = {
  userIdex ,
  userPost,
  userPut,
  userPatch,
  userDelete,
};