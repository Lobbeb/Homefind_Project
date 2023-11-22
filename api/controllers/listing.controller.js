import Listing from "../models/listing.model.js";

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
