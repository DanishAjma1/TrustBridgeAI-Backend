// ...existing code...
import mongoose from "mongoose";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// load .env from project root (three levels up from this file)
dotenv.config({ path: path.resolve(__dirname, "../../..", ".env") });

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
// ...existing code...