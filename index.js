import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv"

import cors from "cors"
//for connect to all IP adress

import authRoute from "./src/routes/auth.js"
import postRoute from "./src/routes/post.js"
import commentRoute from "./src/routes/comments.js"
import userRoute from "./src/routes/user.js"

import { checkAuth } from "./src/utils/auth.js";

import multer from 'multer'

const app = express()
dotenv.config()

// Constans
const PORT = process.env.PORT  
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD

// Middleware
app.use(cors())
app.use(express.json())


// Routes
app.use('/auth/', authRoute)
app.use('/posts/', postRoute)
app.use('/comments/', commentRoute)
app.use('/user/', userRoute)


//for images
const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads')
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    },
})

const upload = multer({ storage })
app.use('/uploads', express.static('uploads'))

app.post('/upload', checkAuth, upload.single('image'), (req,res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    })
})


//START
async function start() {
    try {
        await mongoose.connect(
            `mongodb+srv://${DB_USER}:${DB_PASSWORD}@blog.qgk3jue.mongodb.net/?retryWrites=true&w=majority`
            
        ).then(console.log('Connect to DB'))

        app.listen(PORT, () => console.log(`Server started at ${PORT}`))
    } catch (error) {
        console.log(error)
    }
}   
start()