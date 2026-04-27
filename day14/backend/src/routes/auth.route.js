const express = require('express');
const authController = require('../controller/auth.controller');
const identifyUser = require('../middleware/auth.middleware');

const authRouter = express.Router();

authRouter.post('/register', authController.registerUser);

authRouter.post('/login', authController.loginUser);

authRouter.get('/get-me', identifyUser , authController.getMe);

module.exports = authRouter;