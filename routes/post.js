import { Router } from "express";
import { createPost, getAllPosts, getOnePosts, getMyPosts, removePost, likesPost } from "../controllers/post.js";
import { checkAuth, checkViews } from "../utils/auth.js";

const router = new Router()

router.post('/create', checkAuth, createPost)

router.get('/allposts', getAllPosts)

router.get('/getonepost/:id',checkViews, getOnePosts)

router.get('/myposts', checkAuth, getMyPosts)

router.delete('/delete/:id', checkAuth, removePost)

router.post('/like/:id', checkAuth, likesPost)


export default router