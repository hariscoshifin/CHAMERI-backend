const express = require("express");
const router = express.Router();
const {
  getProjects, getProject, createProject,
  updateProject, deleteProject, reorderProjects,
} = require("../controllers/projectController");
const { protect } = require("../middleware/auth");
const { uploadProjectImage } = require("../middleware/upload");

router.get("/", getProjects);
router.get("/:id", getProject);
router.post("/", protect, uploadProjectImage.single("coverImage"), createProject);
router.put("/reorder", protect, reorderProjects);
router.put("/:id", protect, uploadProjectImage.single("coverImage"), updateProject);
router.delete("/:id", protect, deleteProject);

module.exports = router;
