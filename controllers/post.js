import Post from "../models/Post.js";
import User from "../models/User.js"

export const createPost = async (req, res) => {
    try {
        const { title, text, tags, image } = req.body
        const author = await User.findById(req.userId)

        const newPost = new Post ({
            title,
            text,
            tags,
            image,
            author: {
                id: author._id,
                username: author.username,
                useravatar: author.useravatar
            }
        })

        await newPost.save()
        await User.findByIdAndUpdate(req.userId, {
            $push: {posts: newPost}
        })

        res.json({message: 'Пост добавлен!'})
    } catch (error) {
        res.json({message: 'Не удалось добавить пост!'})
    }
}

export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort("-createdAt")
        const popularPosts = await Post.find().sort("-views")

        if (!posts) {
            return res.json({message: 'Постов не нет!'})
        }

        res.json({posts, popularPosts})

    } catch (error) {
        res.json({message: 'Не удалось получить статьи!'})
    }
}

export const getOnePosts = async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.id, 
            { $inc: { views: 1 } },
            { new: true }
        )

        if (!post) {
            return res.json({message: 'Поста не найдено!'})
        }

        res.json(post)

    } catch (error) {
        res.json({message: 'Не удалось получить пост!'})
    }
}

export const getMyPosts = async (req, res) => {
    try {
        const user = await User.findById(req.userId)

        const list = await Promise.all(
            user.posts.map(post => {
                return Post.findById(post._id)
            })
        )

        res.json(list)

    } catch (error) {
        res.json({message: 'Не удалось получить статьи пользователя!'})
    }
}