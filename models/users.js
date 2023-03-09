const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    username: {
      required: true,
      type: String,
      unique: true,
    },
    email: {
      required: true,
      type: String,
      unique: true,
      match: [/.+@.+\..+/, "Must match an email address!"],
    },
    password: {
      required: true,
      type: String,
    },
    pending: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
