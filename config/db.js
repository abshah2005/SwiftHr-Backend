import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    const connectionString =
      process.env.MONGO_CON_STRING ||
      "mongodb+srv://bilalgillani:KHd64XL0xU5vsLQ6@swifthr.k3uyt.mongodb.net/swift_hr?retryWrites=true&w=majority&appName=SwiftHR";

    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB Connected Successfully...");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

export default connectDB;
