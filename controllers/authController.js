const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const { cloudinary } = require("../config/cloudinary");

// Generate JWT
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });

// @desc   Register admin (superadmin only in production)
// @route  POST /api/auth/register
// @access Public (lock down after first use)
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  const exists = await Admin.findOne({ email });
  if (exists) {
    res.status(400);
    throw new Error("Admin already exists with this email");
  }
  const admin = await Admin.create({ name, email, password, role });
  res.status(201).json({
    success: true,
    token: generateToken(admin._id),
    admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role, avatar: admin.avatar },
  });
});

// @desc   Login admin
// @route  POST /api/auth/login
// @access Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin || !(await admin.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }
  res.json({
    success: true,
    token: generateToken(admin._id),
    admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role, avatar: admin.avatar },
  });
});

// @desc   Get logged-in admin profile
// @route  GET /api/auth/me
// @access Private
const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, admin: req.admin });
});

// @desc   Update password
// @route  PUT /api/auth/update-password
// @access Private
const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const admin = await Admin.findById(req.admin._id);
  if (!(await admin.matchPassword(currentPassword))) {
    res.status(401);
    throw new Error("Current password is incorrect");
  }
  admin.password = newPassword;
  await admin.save();
  res.json({ success: true, message: "Password updated" });
});

// @desc   Update profile (name + avatar)
// @route  PUT /api/auth/update-profile
// @access Private
const updateProfile = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.admin._id);

  // Update display name if provided
  if (req.body.name) admin.name = req.body.name;

  // If a new avatar file was uploaded via Multer/Cloudinary
  if (req.file) {
    // Remove old avatar from Cloudinary if it exists
    if (admin.avatar) {
      const publicId = admin.avatar.split("/").slice(-2).join("/").split(".")[0];
      await cloudinary.uploader.destroy(publicId).catch(() => {}); // non-blocking
    }
    admin.avatar = req.file.path; // Cloudinary URL
  }

  await admin.save();

  res.json({
    success: true,
    message: "Profile updated",
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      avatar: admin.avatar,
    },
  });
});

module.exports = { register, login, getMe, updatePassword, updateProfile };
