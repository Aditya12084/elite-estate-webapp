import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";



export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  // List of reputed email domains
  const allowedDomains = ["gmail.com", "outlook.com", "yahoo.com"];

  try {
    // Extract the domain from the email
    const emailDomain = email.split("@")[1];

    // Check if the domain is in the allowed list
    if (!allowedDomains.includes(emailDomain)) {
      return res.status(400).json({
        success: false,
        message:
          "Please use a reputed email domain (e.g., Gmail, Outlook, Yahoo)",
      });
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);

    // Create a new user
    const newUser = new User({ username, email, password: hashedPassword });

    // Save the user to the database
    await newUser.save();
    
    res.status(201).json({
      success: true,
      message: "User created successfully!",
    });
  } catch (error) {
    // Handle any unexpected errors
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the user.",
    });
  }
};



export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // Check if the user exists
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User not found!"));
    }

    // Check if the password is valid
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(401, "Wrong credentials!"));
    }

    // Generate JWT token
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);

    // Return user data without password
    const { password: pass, ...rest } = validUser._doc;
    return res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(errorHandler(500, "Internal server error!"));
  }
};

export const signOut = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("User has been logged out!");
  } catch (error) {
    next(error);
  }
};
