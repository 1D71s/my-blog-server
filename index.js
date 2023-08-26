import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv"

const app = express()
dotenv.config()

// Constans
const PORT = process.env.PORT  
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD

// Middleware
app.use(express.json())


// Routes
app.get('/', (req, res) => {
    res.json({message: 'all is fine'})
})

async function start() {
    try {
        await mongoose.connect(
            `mongodb+srv://${DB_USER}:${DB_PASSWORD}@blog.qgk3jue.mongodb.net/?retryWrites=true&w=majority`
            //mongodb+srv://admin:Sisa12345+@blog.qgk3jue.mongodb.net/?retryWrites=true&w=majority
        ).then(console.log('Connect to DB'))

        app.listen(PORT, () => console.log(`Server started at ${PORT}`))
    } catch (error) {
        console.log(error)
    }
}   
start()