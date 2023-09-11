import User from "../models/User.js"

export const editProfile = async (req, res) => {
    try {
        await User.updateOne(
            {
                _id: req.userId
            },
            {
                useravatar: req.body.useravatar
            }
        );

        res.json({ message: 'Фото профиля изменено' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Что-то пошло не так!' });
    }
};
