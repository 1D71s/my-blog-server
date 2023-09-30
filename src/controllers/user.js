import User from "../models/User.js"
import Post from "../models/Post.js";
import * as EmailValidator from 'email-validator';


export const editProfile = async (req, res) => {
    try {

        const { username, email, image, fullInfo, sex, firstName, lastName } = req.body

        const existingUser = await User.findOne({
            $and: [
              { _id: { $ne: req.userId } }, // Этот условие исключит текущего пользователя
              { $or: [{ username }, { email }] }
            ]
        });

        if (existingUser) {
            let message = '';
            if (existingUser.username === username) {
                message = 'Такой пользователь с таким именем уже занят!'
            }
            if (existingUser.email === email) {
                message = 'Такой пользователь с такой почтой уже занят!'
            }
            res.json({ message });
        } else if (!EmailValidator.validate(email)) {
            res.json({ message: 'Некорректный адрес электронной почты!' });
        } else {
            await User.updateOne(
                {
                    _id: req.userId
                },
                {
                    useravatar: image,
                    username,
                    email,
                    sex,
                    firstName,
                    lastName,
                    fullInfo: {...fullInfo}
                }
            );
    
            res.json({ message: 'Профиль обновлен!' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Что-то пошло не так!' });
    }
};


export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id); 

        if (!user) {
            return res.json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Can't get user" }); 
    }
};


export const getAllUser = async (req, res) => {
    try {
        const users = await User.find();

        function getRandomUsers(usersArray, count) {
            const shuffledArray = [...usersArray];
            for (let i = shuffledArray.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
            }
            return shuffledArray.slice(0, count);
        }

        const randomUsers = getRandomUsers(users, 15); 
        
        res.status(200).json(randomUsers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Can't get users" });
    }
}

export const followUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        const post = await User.findById(req.params.id);
    
        if (!post) {
            return res.status(404).json({ message: "User don't found!" });
        }

        if (user._id === post._id) {
            return res.status(404).json({ message: "You can't follow to youself" });
        }
    
        const following = post.followers.includes(user._id);
        const follow = user.following.includes(user._id);
  
        if (follow || following) {
            await User.findByIdAndUpdate(post, {
                $pull: { followers: user._id }
            });

            await User.findByIdAndUpdate(user, {
                $pull: { following: post._id }
            });

            res.json({ message: 'followig!' });
        } else {
            post.followers.push(user._id);
            await post.save();

            user.following.push(post._id);
            await user.save();

            res.json({ message: 'unfollowing!' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Invalid server!" });
    }
};

export const getFollowers = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('followers');
    
        if (!user) {
            return res.status(404).json({ message: "User don't found!" });
        }

        res.json(user.followers)
    
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Invalid server!" });
    }
};

export const getFollowing = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('following');
    
        if (!user) {
            return res.status(404).json({ message: "User don't found!" });
        }

        res.json(user.following)
    
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Invalid server!" });
    }
};


export const addToFavorivePost = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        const post = await Post.findById(req.params.id);
    
        if (!post) {
            return res.status(404).json({ message: "Post don't found!" });
        }
        
        const added = user.favorite.includes(post._id);
  
        if (added) {
            await User.findByIdAndUpdate(user, {
                $pull: { favorite: post._id }
            });

            res.json({ message: 'Deleted!' });

        } else {
            user.favorite.push(post);
            await user.save();

            res.json({ message: 'Added to favorite!' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Invalid server!" });
    }
};

export const getFavorite = async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate('favorite');
    
        if (!user) {
            return res.status(404).json({ message: "User don't found!" });
        }

        const favorite = await Promise.all(
            user.favorite.map(post => {
                return Post.findById(post._id).populate('author')
            }).reverse()
        )

        res.json(favorite)
    
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Invalid server!" });
    }
};
