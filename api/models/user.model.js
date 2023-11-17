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
        "https://steamuserimages-a.akamaihd.net/ugc/89344691192944838/1096184BD6AF5B5DB69C6BDD709E10F9AF79382F/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false",
    }, //Pepe the frog picture
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema); // Create model from schema
export default User; // Export model
