
const express = require("express");
const router = express.Router();

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Your middleware filename is authmiddleware.js
const authMiddleware = require("../middleware/authmiddleware");

// ================= REGISTER =================

router.post("/register", async (req, res) => {
  try {
    const {
      fullName,
      registrationNumber,
      email,
      password
    } = req.body;

    if (!fullName || !registrationNumber || !email || !password) {
      return res.status(400).json({
        message: "Please fill all fields"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedRegNo = registrationNumber.trim();

    const existingUser = await User.findOne({
      $or: [
        { email: normalizedEmail },
        { registrationNumber: normalizedRegNo }
      ]
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email or registration number already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName: fullName.trim(),
      registrationNumber: normalizedRegNo,
      email: normalizedEmail,
      password: hashedPassword
    });

    await newUser.save();

    return res.status(201).json({
      message: "Registration successful"
    });

  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      message: "Registration failed",
      error: error.message
    });
  }
});

// ================= LOGIN =================

router.post("/login", async (req, res) => {
  try {
    const { registrationNumber, email, password } = req.body;

    if ((!registrationNumber && !email) || !password) {
      return res.status(400).json({
        message: "Please enter registration number and password"
      });
    }

    let user;

    // Login using registration number
    if (registrationNumber) {
      user = await User.findOne({
        registrationNumber: registrationNumber.trim()
      });
    }

    // Login using email (also supported)
    else {
      user = await User.findOne({
        email: email.trim().toLowerCase()
      });
    }

    console.log("Login user found:", user ? "YES" : "NO");

    if (!user) {
      return res.status(400).json({
        message: "Invalid registration number or password"
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    console.log("Password matched:", isMatch ? "YES" : "NO");

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid registration number or password"
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        registrationNumber: user.registrationNumber,
        email: user.email
      }
    });

  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Login failed",
      error: error.message
    });
  }
});

// ================= GET STUDENT PROFILE =================

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    return res.status(200).json({
      message: "Profile fetched successfully",
      user
    });

  } catch (error) {
    console.error("Profile error:", error);

    return res.status(500).json({
      message: "Unable to fetch profile",
      error: error.message
    });
  }
});

module.exports = router;
