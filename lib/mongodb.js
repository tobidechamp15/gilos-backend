import mongoose from "mongoose";

const MONGO_URI =
  "mongodb+srv://devChamp:champ@cluster0.b4dws.mongodb.net/gilos?retryWrites=true&w=majority&appName=Cluster0";

if (!MONGO_URI) {
  throw new Error("Please define the MONGO_URI environment variable.");
}

// Use a global variable to track the connection status to avoid multiple connections in development
let isConnected = global.isConnected || false;

const dbConnect = async () => {
  if (isConnected) {
    console.log("Already connected to MongoDB");
    return;
  }

  try {
    const db = await mongoose.connect(MONGO_URI);
    isConnected = db.connections[0].readyState === 1;
    global.isConnected = isConnected; // Save connection state globally
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};

dbConnect();
export default dbConnect;