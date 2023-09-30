import mongoose, { Schema } from "mongoose";

const PostSchema = new Schema({
    title: { type: String, required: true },
    tags: { type: Array, default: [] },
    text: { type: String, required: true },
    views: { type: Array, default: [] },
    image: { type: String, default: '' },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    likes: { type: Array, default: [] },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
}, {timestamps: true,})

export default mongoose.model('Post', PostSchema)