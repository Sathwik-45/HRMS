const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: false, // null for global chat and room messages
    },
    chatRoom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatRoom",
      required: false, // null for global chat and private messages
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    messageType: {
      type: String,
      enum: ["text", "image", "file", "audio", "video"],
      default: "text",
    },
    fileName: {
      type: String,
      default: null,
    },
    fileUrl: {
      type: String,
      default: null,
    },
    fileSize: {
      type: Number,
      default: null,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
      default: null,
    },
    isGlobal: {
      type: Boolean,
      default: true, // true for global chat, false for private messages and room messages
    },
    messageScope: {
      type: String,
      enum: ["global", "private", "room"],
      default: "global",
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    editedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
messageSchema.index({ sender: 1, receiver: 1, createdAt: -1 });
messageSchema.index({ isGlobal: 1, createdAt: -1 });
messageSchema.index({ chatRoom: 1, createdAt: -1 });
messageSchema.index({ messageScope: 1, createdAt: -1 });

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
