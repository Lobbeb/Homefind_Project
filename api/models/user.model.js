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
    avatar: {
      type: String,
      default:
        "https://www.google.com/imgres?imgurl=https%3A%2F%2Fichef.bbci.co.uk%2Fnews%2F640%2Fcpsprodpb%2F16620%2Fproduction%2F_91408619_55df76d5-2245-41c1-8031-07a4da3f313f.jpg&tbnid=w7RZbWzjvB9LJM&vet=12ahUKEwi-m_6R7sqCAxWYNt4KHaJqAo0QMygAegQIARAt..i&imgrefurl=https%3A%2F%2Fwww.bbc.com%2Fnews%2Fworld-us-canada-37493165&docid=H3Zkym60J8wzxM&w=640&h=557&q=pepe%20the%20frog%20profile%20image&ved=2ahUKEwi-m_6R7sqCAxWYNt4KHaJqAo0QMygAegQIARAt",
    }, //Pepe the frog picture
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema); // Create model from schema
export default User; // Export model
