import { Router } from "express";
import { changeProfile } from "../controllers/user.js";
import { checkAuth } from "../utils/auth.js";

const router = new Router()

router.post('/change', checkAuth, changeProfile)

export default router