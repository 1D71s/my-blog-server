import jwt from 'jsonwebtoken';
import User from "../models/User.js";
import bcrypt from 'bcryptjs'

export const register = async (req, res) => { 
    try {
        const { username, email, password } = req.body

        const existingUser = await User.findOne({ $or: [{ username }, { email }] });

        if (existingUser) {
            let message = '';
            if (existingUser.username === username) {
                message = 'Такой пользователь с таким именем уже занят'
            }
            if (existingUser.email === email) {
                message = 'Такой пользователь с такой почтой уже занят'
            }
            res.json({message});
            return;
        }
        
        const satl = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, satl)

        const newUser = new User({
            username,
            email,
            password: hash,
        })

        await newUser.save()

        res.json({ message: 'Регистрация прошла успешно' })

    } catch (error) { 
        res.json({message: 'Ошибка при создании пользователя'})
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        
        const user = await User.findOne({email})

        if (!user) {
            return res.json({
                message: 'Такого пользователя не существует'
            })
        }

        const isPasswordCorect = await bcrypt.compare(password, user.password)

        if (!isPasswordCorect) {
            return res.json({
                message: 'Неверный пароль'
            })
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            {expiresIn: '30d'}
        )

        res.json({
            id: user._id,
            token,
            message: 'Вы вошли в систему'
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Ошибка при авторизации'})
    }
}

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден'
            });
        }

        return res.json({ user });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Что-то пошло не так' });
    }
};
