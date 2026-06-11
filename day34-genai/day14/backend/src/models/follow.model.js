const mongoose = require("mongoose");
const { redirect } = require("react-router-dom");

const followSchema = new mongoose.Schema({
  follower:{
    type:String
  },
  //jisko follow karna hai uska id
  followee:{
    type:String
  },
  status:{
    type:String,
    default:"pending",
    enum:{
      values:["pending", "accepted", "rejected"],
      message:"Status can only be pending, accepted or rejected"
    }
  }
  },{
    timestamps:true
  })

  followSchema.index({follower:1, followee:1}, {unique:true})

const followModel = mongoose.model("follows", followSchema);

module.exports = followModel; 