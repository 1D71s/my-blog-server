import { Router } from "express";
import { createComment, removeComment } from "../controllers/comment.js";
import { checkAuth } from "../utils/auth.js";

const router = new Router()

router.post('/create/:id', checkAuth, createComment)

router.delete('/remove/:id/post:post', checkAuth, removeComment)

export default router