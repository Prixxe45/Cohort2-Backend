const postModel = require("../models/post.modle");
const ImageKit = require("@imagekit/nodejs");
const {toFile} = require("@imagekit/nodejs");
const jwt = require("jsonwebtoken");
const likeModel = require("../models/like.model");

const client = new ImageKit({
  privateKey: process.env['IMAGEKIT_PRIVATE_KEY'], 
});

async function createPostController(req, res) {




const file = await client.files.upload({
  file: await toFile(Buffer.from(req.file.buffer), 'file'),
  fileName:'test',
  folder:"posts-instagram"
});
const post = await postModel.create({
  caption:req.body.caption,
  imageUrl:file.url,
  userId:req.user.id
})
res.status(201).json({
  message:"Post created successfully",
  post
})
}

async function getAllPosts(req,res){

 
  const userId = req.user.id;

  const posts = await postModel.find({
    userId:userId
  })

  res.status(200).json({
    message:"Posts fetched successfully",
    posts:posts
  })

}

async function getPostById(req,res){

const userId = req.user.id;
const postId = req.params.postId;

const post = await postModel.findById(postId);

if(!post){
  return res.status(404).json({
    message:"Post not found"
  })
}
const isOwner = post.userId.toString() === userId;

if(!isOwner){
  return res.status(403).json({
    message:"Forbidden access"
  })
}
res.status(200).json({
  message:"Post fetched successfully",
  post
})
}

async function likePostController(req,res){
  const username = req.user.username;
  const postId = req.params.postId;

  const post = await postModel.findById(postId);
  if(!post){
    return res.status(404).json({
      message:"Post not found"
    })

}
const like = await likeModel.create({
  post:postId,
  user:username
})

res.status(201).json({
  message:"Post liked successfully",
  like
})
}

module.exports = {
  createPostController,
  getAllPosts,
  getPostById,
  likePostController
}