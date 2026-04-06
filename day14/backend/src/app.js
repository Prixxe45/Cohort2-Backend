const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');


const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))

//Require routes
const authRouter = require('./routes/auth.route');
const postRouter = require('./routes/post.routes');
const userRouter = require('./routes/user.routes');

// Using Routes
app.use("/auth", authRouter);
app.use("/post", postRouter);
app.use("/user", userRouter);

module.exports = app