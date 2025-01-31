import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";
import User from "../models/user.model.js";
import { MongoClient, ObjectId } from "mongodb";
export const createListing = async (req, res, next) => {
  try {
    console.log(req.body);
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, "Listing not found!"));
  }

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can only delete your own listings!"));
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("Listing has been deleted!");
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, "Listing not found!"));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can only update your own listings!"));
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "Listing not found!"));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  console.log("Received query:", req.query);
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    let query = {};

    if (req.query.offer !== undefined) {
      query.offer = req.query.offer === "true";
    }

    if (req.query.furnished !== undefined) {
      query.furnished = req.query.furnished === "true"; // Ensure true/false conversion
    }

    if (req.query.parking !== undefined) {
      query.parking = req.query.parking === "true"; // Ensure true/false conversion
    }

    // Check and set filters for 'type' (rent/sale)
    if (req.query.type && req.query.type !== "all") {
      query.type = req.query.type;
    }

    // Add search term (case-insensitive)
    if (req.query.searchTerm) {
      query.name = { $regex: req.query.searchTerm, $options: "i" }; // Case-insensitive search
    }

    console.log("Constructed Query:", JSON.stringify(query, null, 2));

    const sort = req.query.sort || "createdAt"; // Default sorting
    const order = req.query.order === "asc" ? 1 : -1; // Ensure order is set properly

    // Fetch listings from MongoDB
    const listings = await Listing.find(query)
      .sort({ [sort]: order }) // Use constructed sort order
      .limit(limit)
      .skip(startIndex);

    console.log("Listings found:", listings.length);
    if (listings.length === 0) {
      console.log("No listings found with the provided criteria.");
    }

    return res.status(200).json(listings);
  } catch (error) {
    console.error("Error fetching listings:", error);
    next(error);
  }
};

export const addToWishList = async (req, res, next) => {
  try {
    if (req.params.id) {
      const listing = await Listing.findById(req.params.id);
      if (listing) {
        const user = await User.findById(req.user.id);

        if (!user) {
          return res.status(401).json("Something went wrong!!");
        }
        console.log(user.wishlist.includes(listing._id));
        if (
          !user.wishlist.includes(listing._id) &&
          !listing.wishlisted_people.includes(user._id)
        ) {
          await user.updateOne({ $push: { wishlist: listing._id } });
          await listing.updateOne({
            $push: { wishlisted_people: user._id },
          });
          return res.status(201).json("Property added to wishlist!");
        } else {
          await user.updateOne({ $pull: { wishlist: listing._id } });
          await listing.updateOne({ $pull: { wishlisted_people: user._id } });
          return res.status(200).json("Property removed from wishlist");
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export const fetchWishList = async (req, res, next) => {
  try {
    // Get the customer ID from the request
    const customerId = req.user.id;

    // Find the user by their ID
    const user = await User.findOne({ _id: customerId });

    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    // Get the wishlist IDs from the user
    const wishlistIds = user.wishlist.map((id) => id);

    // Find the listings that match the wishlist IDs
    const listings = await Listing.find({ _id: { $in: wishlistIds } });

    if (!listings || listings.length === 0) {
      console.log("No listings found in the wishlist");
      return res
        .status(404)
        .json({ message: "No listings found in the wishlist" });
    }

    // Remove the 'wishlisted_people' field from each listing
    const cleanedListings = listings.map((listing) => {
      const { wishlisted_people, userRef, ...rest } = listing.toObject(); // Convert Mongoose document to plain object
      return rest;
    });

    // Log the cleaned listings
    console.log("Wishlist Listings:", cleanedListings);

    // Return the cleaned listings as the response
    return res.status(200).json(cleanedListings);
  } catch (error) {
    console.log(error);
  }
};
