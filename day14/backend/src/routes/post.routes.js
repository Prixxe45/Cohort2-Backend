const express = require("express");
const postRouter = express.Router();
const postController = require("../controller/post.controller");
const multer = require("multer");
const upload = multer({storage: multer.memoryStorage()});
const identifyUser = require("../middleware/auth.middleware");


//Post /api/posts[protected]

postRouter.post("/", upload.single("image"), identifyUser, postController.createPostController)

postRouter.get("/", identifyUser, postController.getAllPosts)

postRouter.get("/details/:postId", identifyUser, postController.getPostById)

/**
 * @route  /posts/like/:postId
 * @description` Like a post with the given postId. 
 */
postRouter.post("/like/:postId", identifyUser, postController.likePostController)

module.exports = postRouter;