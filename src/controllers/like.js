import Like from "../models/Like.js";
import Post from "../models/Post.js";
import User from "../models/User.js";

export const likesPost = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        const postId = req.params.id;
        const post = await Post.findById(postId);
    
        if (!post) {
            return res.status(404).json({ message: "Пост не найден" });
        }
    
        const isLiked = post.likes.includes(user._id);
  
        if (isLiked) {
            await Post.findByIdAndUpdate(postId, {
                $pull: { likes: user._id }
            });
            const postUp = await Post.findById(postId);
            res.json({ status: false, count: postUp.likes.length });
        } else {
            post.likes.push(user._id);
            await post.save();
            const newLike = new Like({
                user: user._id
            })
            await newLike.save()
            const postUp = await Post.findById(postId);
            res.json({ status: true, count: postUp.likes.length});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
};

