const express = require('express');
const userModel = require('../models/user.model');  
const jwt = require('jsonwebtoken');
const authRouter = express.Router();

authRouter.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  const isUserExist = await userModel.findOne({
email
  })
  if (isUserExist) {
    return res.status(400).json({ message: 'User already exists' });
  }
 const user = await userModel.create({ name, email, password })

const token = jwt.sign({
  id: user._id
},process.env.JWT_SECRET)

res.cookie('jwt_token', token)

  res.status(201).json({ message: 'User registered successfully', user , token });
});

authRouter.post("/login",async(req,res)=>{
  const {email, password} = req.body

  const user = await userModel.findOne({email})

  if(!user){
    return res.status(404).json({
      message:"User Not Found"
    })
  }

const isPasswordMatched = user.password === password

 if(!isPasswordMatched){
    return res.status(401).json({
      message:"invalid password"
    })
  }

const token = jwt.sign({
  id: user._id,
},process.env.JWT_SECRET)

res.cookie("jwt_token", token)

res.status(200).json({
  message:"user logged in",
  user
})

})
module.exports = authRouter;