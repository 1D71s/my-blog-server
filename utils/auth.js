import jwt from "jsonwebtoken"

export const checkAuth = async(req, res, next) => {
    
    const token = (req.headers.authorization || '').replace('Bearer ', '');

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            req.userId = decoded.id

            next()

        } catch (error) {
            res.json({message: 'Нет доступа'})
        }
    } else {
        res.json({message: 'Нет доступа!'})
    }

}