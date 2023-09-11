import Post from "../models/Post.js";
import User from "../models/User.js"
import Comment from "../models/Comment.js"

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
        const postId = req.params.id;
        const userId = req.userId;

        const post = await Post.findById(postId);

        if (!post) {
            return res.json({ message: 'Поста не найдено!' });
        }

        if (!post.views.includes(userId) && userId !== 'no user') {
            post.views.push(userId);
            await post.save();
        }

        const comments = await Promise.all(
            post.comments.map(post => {
                return Comment.findById(post._id)
            })
        )

        res.json({...post._doc, comments});

    } catch (error) {
        res.json({ message: 'Не удалось получить пост!' });
    }
};


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

export const likesPost = async (req, res) => {
    try {
      const userId = req.userId;
      const postId = req.params.id;
  
      const post = await Post.findById(postId);
  
      if (!post) {
        return res.status(404).json({ message: "Пост не найден" });
      }
  
      const isLiked = post.likes.includes(userId);
  
      if (isLiked) {
        await Post.findByIdAndUpdate(postId, {
          $pull: { likes: userId }
        });
          
        res.json({ message: "Лайк удален" });
      } else {
        post.likes.push(userId);
        await post.save();
        res.json({ message: "Лайк добавлен" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Ошибка сервера" });
    }
};


