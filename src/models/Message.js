import mongoose, { Schema } from "mongoose";

const DialogSchema = new Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [
    {
      sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      content: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
      read: {type: Boolean, default: false}
    },
  ],
}, { timestamps: true });

export default mongoose.model('Dialog', DialogSchema);
