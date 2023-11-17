import User from "../models/user.model.js"; // Import user model
import bcryptjs from "bcryptjs"; // Import bcryptjs for password hashing
import { errorHandler } from "../utils/error.js"; // Import error handler
import jwt from "jsonwebtoken"; // Import jsonwebtoken for creating tokens

// TODO: Add First & last - name to the signup, potential add more stuff
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

//Sign in function

export const signin = async (req, res, next) => {
  const { email, password } = req.body; // Get email and password from request body
  try {
    const validUser = await User.findOne({ email }); // Find the user by email
    if (!validUser) return next(errorHandler(404, "user not found")); // If user not found, send error

    const validPassword = bcryptjs.compareSync(password, validUser.password); // Compare the passwords <- because we hashed it
    if (!validPassword) return next(errorHandler(401, "Wrong password")); // If password is invalid, send error
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET); // Create a token
    const { password: pass, ...rest } = validUser._doc; // Get all the user data except password
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json({ rest }); // Send token as cookies and user data as response
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    // Find the user by email aka google account
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET); // Create a token
      const { password: pass, ...rest } = user._doc; // Get all the user data except password
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json({ rest }); // Send token as cookies and user data as response
    } else {
      // Create a new user if you dont have google account
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10); // Hash the password
      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-5),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET); // Create a token
      const { password: pass, ...rest } = newUser._doc; // Get all the user data except password
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json({ rest }); // Send token as cookies and user data as response
    }
  } catch (error) {
    next(error);
  }
};
