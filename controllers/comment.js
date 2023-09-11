import User from "../models/User.js";
import Comment from "../models/Comment.js";
import Post from "../models/Post.js";

export const createComment = async (req, res) => {
    try {
        const author = await User.findById(req.userId);
        const text = req.body.text

        const comment = new Comment({
            text,
            author: {
                id: author.id,
                username: author.username,
                useravatar: author.useravatar
            }
        })

        await comment.save()

        await Post.findByIdAndUpdate(req.params.id, {
            $push: {comments: comment}
        })

        res.json({message: 'Комментарий отправлен!'})

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Что-то пошло не так!' });
    }
};

export const removeComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id)
        if (req.userId === comment.author.id) {
            await Comment.findByIdAndDelete(req.params.id)

            await Post.findByIdAndUpdate(req.params.post, {
                $pull: { comments: req.params.id }
            })

            res.json({ message: 'Комментарий удален!' })
        } else {
            res.status(403).json({ message: 'Нет разрешения на удаление комментария!' })
        }
    } catch (error) {
        return res.status(500).json({ message: 'Не получилось удалить комментарий!' });
    }
};
