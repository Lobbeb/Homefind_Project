import User from "../models/user.model.js"; // Import user model
import bcryptjs from "bcryptjs"; // Import bcryptjs for password hashing
import { errorHandler } from "../utils/error.js"; // Import error handler
import jwt from "jsonwebtoken"; // Import jsonwebtoken for creating tokens

//TODO: Add First & last - name to the signup, potential add more stuff <- same in signup.js and  user.model.js
//TODO: Basically go into auth.controller, signup.jsx and user.model to add confirmation of password and other stuff. when signing up.
// Signup controller
export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json("User created successfully");
  } catch (error) {
    next(error);
  }
};

// Signin controller
export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return next(errorHandler(404, "User not found"));

    const isPasswordValid = bcryptjs.compareSync(password, user.password);
    if (!isPasswordValid) return next(errorHandler(401, "Wrong password"));

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    const { password: pass, ...userData } = user._doc;

    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(userData);
  } catch (error) {
    next(error);
  }
};

// Google authentication controller
export const google = async (req, res, next) => {
  try {
    const { email, name, photo } = req.body;
    let user = await User.findOne({ email });

    if (!user) {
      const generatedPassword =
        Math.random().toString(36).slice(-5) +
        Math.random().toString(36).slice(-5);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

      user = new User({
        username:
          name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-5),
        email: email,
        password: hashedPassword,
        avatar: photo,
      });

      await user.save();
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    const { password: pass, ...userData } = user._doc;

    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(userData);
  } catch (error) {
    next(error);
  }
};

//signout controller
export const signOut = (req, res, next) => {
  try {
    // Clear the access token cookie
    res.clearCookie("access_token");

    // Send a successful JSON response
    res.status(200).json({
      success: true,
      message: "Signout successfully",
    });
  } catch (error) {
    // Handle any errors that occur during sign out
    next(error);
  }
};
