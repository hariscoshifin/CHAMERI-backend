const asyncHandler = require("express-async-handler");
const Project = require("../models/Project");
const { cloudinary } = require("../config/cloudinary");

// @desc   Get all projects
// @route  GET /api/projects
const getProjects = asyncHandler(async (req, res) => {
  const { status, category, featured } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (category) filter.category = category;
  if (featured) filter.isFeatured = featured === "true";

  const projects = await Project.find(filter).sort({ order: 1, createdAt: -1 });
  res.json({ success: true, count: projects.length, data: projects });
});

// @desc   Get single project
// @route  GET /api/projects/:id
const getProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) { res.status(404); throw new Error("Project not found"); }
  res.json({ success: true, data: project });
});

// @desc   Create project
// @route  POST /api/projects
const createProject = asyncHandler(async (req, res) => {
  const coverImage = req.file?.path || req.body.coverImage;
  const project = await Project.create({ ...req.body, coverImage });
  res.status(201).json({ success: true, data: project });
});

// @desc   Update project
// @route  PUT /api/projects/:id
const updateProject = asyncHandler(async (req, res) => {
  let project = await Project.findById(req.params.id);
  if (!project) { res.status(404); throw new Error("Project not found"); }
  if (req.file) req.body.coverImage = req.file.path;
  project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  res.json({ success: true, data: project });
});

// @desc   Delete project
// @route  DELETE /api/projects/:id
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) { res.status(404); throw new Error("Project not found"); }
  // Delete cover image from Cloudinary
  if (project.coverImage) {
    const publicId = project.coverImage.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(`chameri/projects/${publicId}`);
  }
  await project.deleteOne();
  res.json({ success: true, message: "Project deleted" });
});

// @desc   Reorder projects
// @route  PUT /api/projects/reorder
const reorderProjects = asyncHandler(async (req, res) => {
  const { orderedIds } = req.body; // array of { id, order }
  const updates = orderedIds.map(({ id, order }) =>
    Project.findByIdAndUpdate(id, { order })
  );
  await Promise.all(updates);
  res.json({ success: true, message: "Order updated" });
});

module.exports = { getProjects, getProject, createProject, updateProject, deleteProject, reorderProjects };
