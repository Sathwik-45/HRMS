const mongoose = require("mongoose");
require("dotenv").config();

const uri = process.env.MONGODB_URI;

console.log("Attempting to connect to MongoDB...");
console.log("URI:", uri ? uri.replace(/:([^@]+)@/, ":****@") : "MISSING");

mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
    .then(() => {
        console.log("✅ Successfully connected to MongoDB!");
        process.exit(0);
    })
    .catch((err) => {
        console.error("❌ Connection failed:");
        console.error(err.message);
        console.log("\nPossible causes:");
        console.log("1. Your IP address is not whitelisted in MongoDB Atlas.");
        console.log("2. The username or password in MONGODB_URI is incorrect.");
        console.log("3. You have a firewall or proxy blocking the connection.");
        process.exit(1);
    });
