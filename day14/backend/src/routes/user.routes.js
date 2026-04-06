const express = require("express");
const userController = require("../controller/user.controller");
const identifyUser = require("../middleware/auth.middleware");

const  userRouter = express.Router();

userRouter.post("/follow/:username", identifyUser, userController.sendFollowRequestController);

userRouter.post("/follow/accept/:username", identifyUser, userController.acceptFollowRequestController);

userRouter.post("/follow/reject/:username", identifyUser, userController.rejectFollowRequestController);

userRouter.post("/unfollow/:username", identifyUser, userController.unfollowUserController);




module.exports = userRouter;