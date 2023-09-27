import { Router } from "express";
import { editProfile, getUser, getAllUser, followUser } from "../controllers/user.js";
import { checkAuth } from "../utils/auth.js";

const router = new Router()

router.put('/change', checkAuth, editProfile)

router.get('/fullinfo/:id', getUser)

router.get('/getall', getAllUser)

router.put('/follow/:id', checkAuth, followUser)

export default router