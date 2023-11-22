import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";
import mongoose from "mongoose";
export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({ success: false, message: error.message }); // Send the actual error message
  }
};

export const deleteListing = async (req, res, next) => {
  const { id } = req.params;
  const { id: userId } = req.user;

  try {
    const listing = await Listing.findById(id);

    if (!listing) {
      return next(errorHandler(404, "Listing not found."));
    }

    if (userId !== listing.userRef.toString()) {
      return next(
        errorHandler(401, "You are not authorized to delete this listing.")
      );
    }

    await Listing.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Listing has been deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

//DONT TOUCH VOLATILE AS HELL
export const updateListing = async (req, res, next) => {
  const listingId = req.params.id;

  // Check if the ID is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(listingId)) {
    return next(errorHandler(400, "Listing not found!"));
  }

  //Not working in insomnia so did database objectId above instead, keeping both for safety checks.

  try {
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return next(errorHandler(404, "Listing not found!"));
    }

    if (req.user.id !== listing.userRef) {
      return next(errorHandler(401, "You can only update your own listings!"));
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      listingId,
      req.body,
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: updatedListing,
      message: "Listing updated successfully",
    });
  } catch (error) {
    next(error);
  }
};
