const asyncHandler = require("express-async-handler");
const Admin = require("../models/Admin");
const Settings = require("../models/Settings");

// ─── Get all users ────────────────────────────────────────────────────────────
// @route  GET /api/admin/users
// @access Private (admin only)
const getUsers = asyncHandler(async (req, res) => {
  const users = await Admin.find()
    .select("-password")
    .sort({ createdAt: -1 });

  // Role stats
  const stats = {
    admin: users.filter((u) => u.role === "admin" || u.role === "superadmin").length,
    editor: users.filter((u) => u.role === "editor").length,
    viewer: users.filter((u) => u.role === "viewer").length,
  };

  res.json({ success: true, data: users, stats });
});

// ─── Create user ──────────────────────────────────────────────────────────────
// @route  POST /api/admin/users
// @access Private (admin only)
const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const exists = await Admin.findOne({ email });
  if (exists) {
    res.status(400);
    throw new Error("A user with this email already exists");
  }

  const user = await Admin.create({ name, email, password, role });

  res.status(201).json({
    success: true,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
});

// ─── Delete user ──────────────────────────────────────────────────────────────
// @route  DELETE /api/admin/users/:id
// @access Private (admin only)
const deleteUser = asyncHandler(async (req, res) => {
  // Prevent self-deletion
  if (req.params.id === req.admin._id.toString()) {
    res.status(400);
    throw new Error("You cannot delete your own account");
  }

  const user = await Admin.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  await user.deleteOne();
  res.json({ success: true, message: "User deleted successfully" });
});

// ─── Update user role ─────────────────────────────────────────────────────────
// @route  PUT /api/admin/users/:id/role
// @access Private (admin only)
const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  const user = await Admin.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  user.role = role;
  await user.save();
  res.json({ success: true, message: "Role updated", data: user });
});

// ─── Get recovery email ───────────────────────────────────────────────────────
// @route  GET /api/admin/recovery-email
// @access Private (admin only)
const getRecoveryEmail = asyncHandler(async (req, res) => {
  const email = await Settings.get("recovery_email");
  res.json({ success: true, data: { email: email || null } });
});

// ─── Set / Update recovery email ─────────────────────────────────────────────
// @route  PUT /api/admin/recovery-email
// @access Private (admin only)
const setRecoveryEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes("@")) {
    res.status(400);
    throw new Error("Please provide a valid email address");
  }
  await Settings.set("recovery_email", email);
  res.json({ success: true, message: "Recovery email updated", data: { email } });
});

module.exports = {
  getUsers,
  createUser,
  deleteUser,
  updateUserRole,
  getRecoveryEmail,
  setRecoveryEmail,
};
