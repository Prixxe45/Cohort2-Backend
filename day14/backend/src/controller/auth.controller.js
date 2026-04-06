const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function registerUser(req,res){
  const{username,email,password,bio,profilepic} = req.body

  const isUserExist = await userModel.findOne({
    $or:[
      {username},
      {email}
    ]
  });

  if(isUserExist){
    return res.status(409)
    .json({
      message:"User already exist" + (isUserExist.username === username ? " Username Already Exists" : " Email Already Exists")
    })
    }

    const hash = await bcrypt.hash(password,10);

    const user = await userModel.create({
      username,
      email,
      password:hash,
      bio,
      profilepic
    });

    const token = jwt.sign(
      {
        id:user._id,
        username:user.username

    },process.env.JWT_SECRET_KEY,{
      expiresIn:"1h"
    });

    res.cookie("token", token)

    res.status(201).json({
      message:"User created successfully",
      user:{
        username:user.username,
        email:user.email,
      }
    });

}

const loginUser = async(req,res)=>{
  const {email,username,password} = req.body;

  const user = await userModel.findOne({
    $or:[
      {email:email},
      {username:username}
    ]
  })
  if(!user){
    return res.status(404).json({
      message:"User not found"
    })
  }


const isPasswordMatch = await bcrypt.compare(password, user.password);

if(!isPasswordMatch){
  return res.status(401).json({
    message:"Invalid credentials"
  })
}

const token = jwt.sign({
  id:user._id, 
   username:user.username
},process.env.JWT_SECRET_KEY,{
  expiresIn:"1d"})

res.cookie("token", token)
res.status(200).json({
  message:"Login successful",
  user:{
    username:user.username,
    email:user.email,
    bio:user.bio,
    profileImage:user.profileImage
  }


})
}

module.exports = {
  registerUser,
  loginUser
}