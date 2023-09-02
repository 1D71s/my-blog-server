import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },password: {
        type: String,
        required: true,
    },
    useravatar: {
        type: String,
        default: 'ava.webp'
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }]
}, { timestamps: true, })

export default mongoose.model('User', UserSchema)