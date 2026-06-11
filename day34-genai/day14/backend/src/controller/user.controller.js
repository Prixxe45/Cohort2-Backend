const followModel = require("../models/follow.model");
const userModel = require("../models/user.model");

async function sendFollowRequestController(req,res){
  const followerUsername = req.user.username; //kon follow kar raha hai
  const followeeUsername = req.params.username; //kon follow ho raha hai

  if(followerUsername === followeeUsername){
    return res.status(400).json({
      message:"You cannot follow yourself"
    })
  }

 const isExisting = await userModel.findOne({ username: followeeUsername });

 if(!isExisting){
   return res.status(404).json({
     message:"User not found"
   })
 }
 const isAlreadyRequested = await followModel.findOne({
  follower:followerUsername,
  followee:followeeUsername
 })
  if(isAlreadyRequested){
    return res.status(400).json({
      message:"Follow request already sent"
    })
  }

 const followRequest = await followModel.create({
  follower:followerUsername,
  followee:followeeUsername,
  status:"pending"
 })
  res.status(200).json({
    message:`Follow request sent to ${followeeUsername}`,
    followRequest
  });

}

async function acceptFollowRequestController(req,res){
  const followerUsername = req.params.username; //kon follow kar raha hai
  const followeeUsername = req.user.username; //jisko follow karna hai uska username
  

  const request = await followModel.findOne({
    follower:followerUsername,
    followee:followeeUsername,
    status:"pending"
  });
  if(!request){
    return res.status(400).json({
      message:"No follow request found"
    })
  }
  request.status = "accepted";
  await request.save();
  res.status(200).json({
    message:"Follow request accepted"
  });

}

async function rejectFollowRequestController(req,res){
  const followeeUsername = req.user.username; //jisko follow karna hai uska username
  const followerUsername = req.params.username; //kon follow kar raha hai

  const request = await followModel.findOne({
    follower:followerUsername,
    followee:req.params.username,
    status:"pending"
  });
  if(!request){
    return res.status(400).json({
      message:"No follow request found"
    })
  }
  await followModel.deleteOne({
    follower:followerUsername,
    followee:req.params.username
  });
  res.status(200).json({
    message:"Follow request rejected"
  });
}

async function unfollowUserController(req,res){
  const followerUsername = req.user.username; //kon unfollow kar raha hai
  const followeeUsername = req.params.username; //kon unfollow ho raha hai

  const isFollowing = await followModel.findOne({
    follower:followerUsername,
    followee:followeeUsername
  });

  if(!isFollowing){
    return res.status(400).json({
      message:"You are not following this user"
    })
  }

  await followModel.deleteOne({
    follower:followerUsername,
    followee:followeeUsername
  });

  res.status(200).json({
    message: `User unfollowed successfully ${followeeUsername}`
  });

}


module.exports = {
  sendFollowRequestController,
  acceptFollowRequestController,
  rejectFollowRequestController,
  unfollowUserController
};