const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  caption:{
    type:String,
    default:""
  },
  imageUrl:{
    type:String,
    required:[true, "Image is required"]
  },
  userId:{
    ref:"users",
    type:mongoose.Schema.Types.ObjectId,
    required:[true, "User is required"]
  }
})

const postModel = mongoose.model("posts", postSchema);

module.exports = postModel;