import Post from "../models/Post.js";
import User from "../models/User.js"

export const createPost = async (req, res) => {
    try {
        const { title, text } = req.body
        const author = await User.findById(req.userId)

        const newPost = new Post ({
            title,
            text,
            author: author
        })

        await newPost.save()
        await User.findByIdAndUpdate(req.userId, {
            $push: {posts: newPost}
        })


        res.json(newPost)
    } catch (error) {
        res.json({message: 'Не удалось добавить пост!'})
    }
}