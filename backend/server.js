
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test backend route
app.get("/", (req, res) => {
    res.send("Student Task Manager Backend Running Successfully!");
});

// Task API routes
app.use("/api/tasks", require("./routes/taskroutes"));

// Authentication API routes
app.use("/api/auth", require("./routes/authRoutes"));

// MongoDB connection
const PORT = process.env.PORT || 5000;

if (!process.env.MONGO_URI) {
    console.log("Error: MONGO_URI is missing in .env file");
    process.exit(1);
}

if (!process.env.JWT_SECRET) {
    console.log("Error: JWT_SECRET is missing in .env file");
    process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.log("MongoDB Connection Error:", error.message);
        process.exit(1);
    });
