import User from "../models/user.model.js"; // Import user model
import bcryptjs from "bcryptjs"; // Import bcryptjs for password hashing

export const signup = async (req, res, next) => {
  // ADD THINGS BELOW FOR SIGNUP RIGHT NOW ONLY USERNAMNE EMAIL AND PASSWORD
  // Signup controller
  const { username, email, password } = req.body; // Get username, password and email from request body
  const hashedPassword = bcryptjs.hashSync(password, 10); // Hash the password

  const newUser = new User({ username, email, password: hashedPassword }); // Create a new user
  try {
    // Try to save the new user
    await newUser.save();
    res.status(201).json("user created succesfully"); // Send a response
  } catch (error) {
    next(error); // Send error to error handler
  }
};
