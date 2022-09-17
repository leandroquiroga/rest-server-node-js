const {request, response} = require('express');
const isAdminRole = (req = request, res = response, next) => {
  
  // verific if the user exist
  if(!req.user)
    return res.status(500).json({
      msg: 'Error! Please contact with administrator'
    });

  const {role} = req.user;
  
  if(role !== 'ADMIN_ROLE') 
    return res.status(401).json({
      msg: 'Only the Admin user can delete a user'
    })
  next();
};


const haveRole = (...roles) => {

  return (req = request, res = response, next) => {
    // Verific the validation of the token
    if(!req.user)
      return res.status(500).json({
        msg: 'Error! Please contact with administrator'
      });
    // console.log(rols, req.user.role);

    // Verific if contains any rol
    if(!roles.includes(req.user.role))
      return res.status(401).json({
        msg: `Role invalid, please enter ${roles}`
      });

      

    next();
  };
};


module.exports = {
  isAdminRole,
  haveRole    
}