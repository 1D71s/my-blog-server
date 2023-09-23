import User from "../models/User.js"
import * as EmailValidator from 'email-validator';


export const editProfile = async (req, res) => {
    try {

        const { username, email, image, fullInfo, sex } = req.body

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
