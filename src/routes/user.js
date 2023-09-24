import { Router } from "express";
import { editProfile, getUser } from "../controllers/user.js";
import { checkAuth } from "../utils/auth.js";

const router = new Router()

router.put('/change', checkAuth, editProfile)

router.get('/fullinfo/:id', getUser)

export default router