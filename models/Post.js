import mongoose, { Schema } from "mongoose";

const PostSchema = new Schema({
    title: { type: String, required: true },
    tags: { type: Array, default: [] },
    text: { type: String, required: true },
    views: { type: Number, default: 0 },
    image: { type: String, default: '' },
    author: {
        id: { type: String, required: true },
        username: { type: String, required: true },
        useravatar: { type: String, required: true },
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' } ]
}, {timestamps: true,})

export default mongoose.model('Post', PostSchema)