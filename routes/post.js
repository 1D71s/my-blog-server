import { Router } from "express";
import { createPost } from "../controllers/post.js";
import { checkAuth } from "../utils/auth.js";

const router = new Router()

router.post('/create', checkAuth, createPost)


export default router