import jwt from 'jsonwebtoken';
import User from "../models/User.js";
import bcrypt from 'bcryptjs'

export const register = async (req, res) => { 
    try {
        const { username, email, password, firstName, lastName, sex } = req.body

        const existingUser = await User.findOne({ $or: [{ username }, { email }] });

        if (existingUser) {
            let message = '';
            if (existingUser.username === username) {
                message = 'This user with this name is already taken!'
            }
            if (existingUser.email === email) {
                message = 'This user with this email is already taken!'
            }
            res.json({ message });
        } else {
            const satl = bcrypt.genSaltSync(10)
            const hash = bcrypt.hashSync(password, satl)

            const newUser = new User({
                username,
                email,
                password: hash,
                firstName,
                lastName,
                sex
            })

            await newUser.save()

            res.json({ message: 'Registration completed successfully!' })
        }
    } catch (error) { 
        res.json({ message: 'Error creating user!' })
    }
}

export const login = async (req, res) => {
    try {
        const { username, password } = req.body
        
        const user = await User.findOne({username})

        if (!user) {
            return res.json({
                message: 'This user does not exist!'
            })
        }

        const isPasswordCorect = await bcrypt.compare(password, user.password)

        if (!isPasswordCorect) {
            return res.json({
                message: 'Incorrect password!'
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
            message: 'You are logged in!'
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Error during authorization!'})
    }
}

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: 'User is not found!'
            });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            {expiresIn: '30d'}
        )

        const { password, ...userData } = user._doc

        return res.json({ ...userData, token });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Something went wrong!' });
    }
};

