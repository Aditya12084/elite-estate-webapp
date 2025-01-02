import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());


const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true, 
};
app.use(cors(corsOptions));

mongoose
  .connect(process.env.DB_PASSWORD, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((err) => {
    console.log("MongoDB connection error: ", err.message);
  });

// Add logging for incoming requests to debug server-side issues
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Define your API routes
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);


const __dirname = path.resolve();
app.use(express.static(path.resolve(__dirname, "client", "dist")));

// Catch-all route to handle frontend routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong!";
  res.status(status).json({
    success: false,
    status,
    message,
  });
});

// Start the server on port 3000
app.listen(3000, () => {
  console.log("Server is running on port 3000!");
});
