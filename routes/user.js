import { Router } from "express";
import { editProfile } from "../controllers/user.js";
import { checkAuth } from "../utils/auth.js";

const router = new Router()

router.post('/change', checkAuth, editProfile)

export default router