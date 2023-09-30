import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    useravatar: { type: String, default: '/uploads/ava.webp' },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    sex: { type: String, required: true },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    favorite: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    fullInfo: {
        myStatus: { type: String, default: '' },
        birthday: { type: String, default: '' },
        country: { type: String, default: ''},
        sity: { type: String, default: '' },
        hobby: { type: String, default: '' },
        university: { type: String, default: '' },
        job: { type: String, default: '' },
        about: { type: String, default: '' },
    },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true, })

export default mongoose.model('User', UserSchema)