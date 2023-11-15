import mongoose from "mongoose";

// TODO: Add First & last - name to the signup, potential add more stuff <- same in signup.jsc and auth.controller.js
const userSchema = new mongoose.Schema( // Schema for user
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema); // Create model from schema
export default User; // Export model
