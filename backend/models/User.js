const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"],
    trim: true,
    minlength: [2, "First name must be at least 2 characters long"],
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
    trim: true,
    minlength: [1, "Last name must be at least 2 characters long"],
  },
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    trim: true,
    minlength: [3, "Username must be at least 3 characters long"],
    maxlength: [20, "Username cannot exceed 20 characters"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters long"],
  },
  phoneNumber: {
    type: String,
    required: [true, "Phone number is required"],
    trim: true,
    match: [/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number"],
  },
  gender: {
    type: String,
    enum: ["male", "female", "other", "prefer-not-to-say"],
    default: "prefer-not-to-say",
  },
  profilePicture: {
    type: String,
    default: "", // URL to the profile picture (optional)
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  termsAccepted: {
    type: Boolean,
    required: [true, "You must accept the terms and conditions"],
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to update the `updatedAt` field on save
UserSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("User", UserSchema);