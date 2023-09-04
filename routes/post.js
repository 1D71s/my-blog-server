import { Router } from "express";
import { createPost, getAllPosts, getOnePosts, getMyPosts, removePost } from "../controllers/post.js";
import { checkAuth } from "../utils/auth.js";

const router = new Router()

router.post('/create', checkAuth, createPost)

router.get('/allposts', getAllPosts)

router.get('/getonepost/:id', getOnePosts)

router.get('/myposts', checkAuth, getMyPosts)

router.delete('/delete/:id', checkAuth, removePost)

export default router