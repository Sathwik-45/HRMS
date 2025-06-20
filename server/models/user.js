const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
     password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    contact: {
      type: Number,
      required: true,
    },

    image: {
      type: String,
      trim: true,
      default:
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400",
    },
  },
  {
    timestamps: true,
  }
);


const User = mongoose.model("users", userSchema);

module.exports = User;
