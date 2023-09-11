import mongoose, { Schema } from "mongoose";

const CommentSchema = new Schema({
    text: { type: String, required: true },
    author: { 
        id: { type: String, required: true },
        username: { type: String, required: true },
        useravatar: { type: String, required: true },
    },

}, {timestamps: true,})

export default mongoose.model('Comment', CommentSchema)