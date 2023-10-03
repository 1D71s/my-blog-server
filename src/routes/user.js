import { Router } from "express";
import { editProfile, getUser, getAllUser, followUser, getFollowers, getFollowing, addToFavorivePost, getFavorite, searchUser } from "../controllers/user.js";
import { checkAuth } from "../utils/auth.js";

const router = new Router()

router.put('/change', checkAuth, editProfile)

router.get('/fullinfo/:id', getUser)

router.get('/getall', getAllUser)

router.put('/follow/:id', checkAuth, followUser)

router.get('/followers/:id', getFollowers)

router.get('/following/:id', getFollowing)

router.put('/favorite/:id', checkAuth, addToFavorivePost)

router.get('/favorite/', checkAuth, getFavorite)

router.post('/search/', searchUser)

export default router