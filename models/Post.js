import mongoose, { Schema } from "mongoose";

const PostSchema = new Schema({
    title: { type: String, required: true },
    tags: { type: Array, default: [] },
    text: { type: String, required: true },
    views: { type: Number, default: 0 },
    image: { type: String, default: '' },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    comments: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' } ]
}, { timeseries: true })

export default mongoose.model('Post', PostSchema)