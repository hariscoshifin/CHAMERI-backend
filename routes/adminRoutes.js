const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  getUsers, createUser, deleteUser,
  updateUserRole, getRecoveryEmail, setRecoveryEmail,
} = require("../controllers/adminController");

// ── Middleware: must be logged in + must be admin/superadmin ─────────────────
const requireAdmin = (req, res, next) => {
  if (req.admin?.role === "admin" || req.admin?.role === "superadmin") {
    return next();
  }
  res.status(403);
  throw new Error("Access denied — admin role required");
};

router.use(protect);       // JWT check
router.use(requireAdmin);  // Role check

// ── User Management ──────────────────────────────────────────────────────────
router.get("/users", getUsers);
router.post("/users", createUser);
router.delete("/users/:id", deleteUser);
router.put("/users/:id/role", updateUserRole);

// ── Recovery Email ───────────────────────────────────────────────────────────
router.get("/recovery-email", getRecoveryEmail);
router.put("/recovery-email", setRecoveryEmail);

module.exports = router;
