import Post from "../models/Post.js";
import User from "../models/User.js"
import Comment from "../models/Comment.js"

export const createPost = async (req, res) => {
    try {
        const { title, text, tags, image } = req.body
        const author = await User.findById(req.userId)

        const uniqueTags = Array.from(new Set(tags));

        const newPost = new Post ({
            title,
            text,
            tags: uniqueTags,
            image,
            author
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
        const posts = await Post.find().sort("-createdAt").populate('author')
        const popularPosts = await Post.find().sort("-views").populate('author')

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
        const postId = req.params.id;
        const userId = req.userId;

        const post = await Post.findById(postId).populate('author');

        if (!post) {
            return res.json({ message: 'Поста не найдено!' });
        }

        if (!post.views.includes(userId) && userId !== 'no user') {
            post.views.push(userId);
            await post.save();
        }

        const comments = await Promise.all(
            post.comments.map(post => {
                return Comment.findById(post._id).populate('author')
            })
        )

        comments.reverse()

        res.json({...post._doc, comments});

    } catch (error) {
        res.json({ message: 'Не удалось получить пост!' });
    }
};


export const getUserPosts = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        const list = await Promise.all(
            user.posts.map(post => {
                return Post.findById(post._id).populate('author')
            }).reverse()
        )

        res.json(list)

    } catch (error) {
        res.json({message: 'Не удалось получить статьи пользователя!'})
    }
}

export const removePost = async (req, res) => {
    try {

        const {id} = req.params
        const post = await Post.findByIdAndDelete(req.params.id)

        if (!post) {
            res.json({ message: 'Статью не найдено!' })
        }

        await User.findByIdAndUpdate(req.userId, {
            $pull: { posts: req.params.id }
        })

        res.json({message: 'Статью удалено!', id})

    } catch (error) {
        res.json({message: 'Не удалось удалить статью!'})
    }
}

export const editPost = async (req, res) => {
    try {
        const { title, text, tags, image } = req.body;
        const post = await Post.findById(req.params.id);

        const uniqueTags = Array.from(new Set(tags));

        if (!post) {
            return res.status(404).json({ message: 'Пост не найден!' });
        }

        if (req.userId !== post.author._id.toString()) {
            console.log(req.userId)
            console.log(post.author._id.toString())
            return res.status(403).json({ message: 'Нет доступа!' });
        }

        await Post.updateOne({ _id: req.params.id }, { title, text, image, tags: uniqueTags });

        res.json({ message: 'Пост успешно обновлен!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Что-то пошло не так!' });
    }
};

export const getTagPosts = async (req, res) => {
    try {
        const tag = req.params.id;

        const posts = await Post.find({ tags: tag }).populate('author');

        if (posts.length === 0) {
            return res.status(404).json({ message: 'Посты с данным тегом не найдены.' });
        }

        res.json(posts.reverse());
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Не удалось получить статьи по тегу.' });
    }
}