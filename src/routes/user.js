import { Router } from "express";
import { editProfile, getUser, getAllUser, followUser, getFollowers, getFollowing } from "../controllers/user.js";
import { checkAuth } from "../utils/auth.js";

const router = new Router()

router.put('/change', checkAuth, editProfile)

router.get('/fullinfo/:id', getUser)

router.get('/getall', getAllUser)

router.put('/follow/:id', checkAuth, followUser)

router.get('/followers/:id', checkAuth, getFollowers)

router.get('/following/:id', checkAuth, getFollowing)

export default router