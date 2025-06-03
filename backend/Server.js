require("dotenv").config({ path: "../.env" }); // Load .env from the parent directory (NEWSFRONT/)
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Debug the MONGO_URI to ensure it's loaded
console.log("MONGO_URI:", process.env.MONGO_URI);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI) // Removed deprecated options
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed:", err);
    process.exit(1);
  });

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ status: "error", message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ status: "error", message: "Invalid token" });
  }
};

// Register API
app.post("/register", async (req, res) => {
  const {
    firstName,
    lastName,
    username,
    email,
    password,
    phoneNumber,
    gender,
    termsAccepted,
  } = req.body;

  // Input validation
  if (
    !firstName ||
    !lastName ||
    !username ||
    !email ||
    !password ||
    !phoneNumber ||
    !termsAccepted
  ) {
    return res.status(400).json({ status: "error", message: "All required fields must be provided" });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message: existingUser.email === email ? "Email already exists" : "Username already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      phoneNumber,
      gender: gender || "prefer-not-to-say",
      termsAccepted,
    });
    await user.save();

    res.status(201).json({ status: "success", message: "User registered successfully" });
  } catch (error) {
    console.error("Error in /register:", error);
    res.status(500).json({ status: "error", message: "Server error", error: error.message });
  }
});

// Login API
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ status: "error", message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ status: "error", message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ status: "error", message: "Invalid credentials" });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined in environment variables");
      return res.status(500).json({ status: "error", message: "Server configuration error" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ status: "success", message: "Login successful", token });
  } catch (error) {
    console.error("Error in /login:", error);
    res.status(500).json({ status: "error", message: "Server error", error: error.message });
  }
});

// Protected Route Example (e.g., for Dashboard)
app.get("/dashboard", authenticateToken, (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Welcome to the dashboard!",
    userId: req.user.userId,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ status: "error", message: "Something went wrong on the server" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
