import {Router} from "express"
import { registerUser } from "../controllers/auth.controller.js";
import {body,validationResult} from "express-validator";

const authRouter = Router()

authRouter.post("/register",registerUser)

export default authRouter;