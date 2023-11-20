import bcryptjs from "bcryptjs"; // Import bcryptjs
import User from "../models/user.model.js"; // Import user model
import { errorHandler } from "../utils/error.js"; // Import error handler

export const test = (req, res) => {
  // Test route
  res.send("api route are working!"); // Send response
};

export const updateUser = async (req, res, next) => {
  try {
    // Check if the user ID from the token matches the user ID in the request parameters
    if (req.user.id !== req.params.id) {
      return next(errorHandler(403, "You can only update your own account."));
    }

    const updateData = {
      username: req.body.username,
      email: req.body.email,
      avatar: req.body.avatar,
    };

    // If a password is provided, hash it before updating the user
    if (req.body.password) {
      const salt = await bcryptjs.genSalt(15);
      updateData.password = await bcryptjs.hash(req.body.password, salt);
    }

    // Attempt to update the user with the new data
    const updatedUserResult = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    // Check if a user was found and updated
    if (!updatedUserResult) {
      return next(errorHandler(404, "User not found."));
    }

    // Exclude the password from the result before sending it to the client
    const { password, ...rest } = updatedUserResult._doc;
    res.status(200).json(rest);
  } catch (error) {
    // Pass any errors to the error handling middleware
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(403, "Can only delete your own account."));
  }
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json("User deleted successfully");
  } catch (error) {
    next(error);
  }
};
