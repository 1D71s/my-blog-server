import { Router } from "express";
import { createComment } from "../controllers/comment.js";
import { checkAuth } from "../utils/auth.js";

const router = new Router()

router.post('/create/:id', checkAuth, createComment)


export default router