import express from "express"
import authRouter from "./routes/auth.routes.js"
import handleError from "./middleware/error.middleware.js"

const app = express();

app.use("/api/auth",authRouter)
app.use(express.json())

app.use(handleError)//hamesha last mai use hoga

export default app;