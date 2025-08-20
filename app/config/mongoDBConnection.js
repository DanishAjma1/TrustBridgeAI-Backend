import mongoose from "mongoose";
import { configDotenv } from "dotenv";
configDotenv();

export const connectDB = async() => {
  try {
    const url = process.env.DB_URL;
    if (!url) {
      throw Error("URL is empty..");
    }
    await mongoose.connect(url);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};
