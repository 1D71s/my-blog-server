import { Router } from "express";
import { likesPost } from "../controllers/like.js";
import { checkAuth } from "../utils/auth.js";

const router = new Router()

router.post('/add/:id', checkAuth, likesPost)

export default router