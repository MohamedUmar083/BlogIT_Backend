import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongodb_url = process.env.MONGODB_URL;

const connectDB = async (req, res) => {
  try {
    const connection = await mongoose.connect(mongodb_url);
    console.log("MongoDB Connected Successfully");
    return connection;
  } catch (error) {
    res.status(500).json({ Message: "MongoDB Connection Error", Error: error });
  }
};

export default connectDB;
