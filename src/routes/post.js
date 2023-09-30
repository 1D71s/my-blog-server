import { Router } from "express";
import { createPost, getAllPosts, getOnePosts, getUserPosts, removePost, editPost, getTagPosts, likesPost } from "../controllers/post.js";
import { checkAuth, checkViews } from "../utils/auth.js";

const router = new Router()

router.post('/create', checkAuth, createPost)

router.get('/allposts', getAllPosts)

router.get('/getonepost/:id',checkViews, getOnePosts)

router.get('/userposts/:id', getUserPosts)

router.delete('/delete/:id', checkAuth, removePost)

router.post('/edit/:id', checkAuth, editPost)

router.get('/tag/:id', getTagPosts)

router.post('/like/:id', checkAuth, likesPost)

export default router