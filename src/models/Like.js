import mongoose, { Schema } from "mongoose";

const LikeSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {timestamps: true,})

export default mongoose.model('Like', LikeSchema)