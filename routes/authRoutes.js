const express = require("express");
const router = express.Router();
const { register, login, getMe, updatePassword, updateProfile } = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const { uploadGeneralImage } = require("../middleware/upload");

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.put("/update-password", protect, updatePassword);
router.put("/update-profile", protect, uploadGeneralImage.single("avatar"), updateProfile);

module.exports = router;
