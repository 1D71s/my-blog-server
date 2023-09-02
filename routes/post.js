import { Router } from "express";
import { createPost, getAllPosts, getOnePosts } from "../controllers/post.js";
import { checkAuth } from "../utils/auth.js";

const router = new Router()

router.post('/create', checkAuth, createPost)

router.get('/allposts', getAllPosts)

router.get('/:id', getOnePosts)


export default router