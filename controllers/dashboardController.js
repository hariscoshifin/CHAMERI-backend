const asyncHandler = require("express-async-handler");
const Project = require("../models/Project");
const Service = require("../models/Service");
const Blog = require("../models/Blog");
const Admin = require("../models/Admin");
const Contact = require("../models/Contact");
const Testimonial = require("../models/Testimonial");

// @desc   Get dashboard stats
// @route  GET /api/dashboard/stats
// @access Private
const getDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalProjects,
    publishedProjects,
    totalServices,
    totalBlogs,
    publishedBlogs,
    totalTeam,
    totalContacts,
    newContacts,
    totalTestimonials,
  ] = await Promise.all([
    Project.countDocuments(),
    Project.countDocuments({ status: "published" }),
    Service.countDocuments({ status: "published" }),
    Blog.countDocuments(),
    Blog.countDocuments({ status: "published" }),
    Admin.countDocuments(),          // totalTeam = all admin users
    Contact.countDocuments(),
    Contact.countDocuments({ status: "new" }),
    Testimonial.countDocuments({ isVisible: true }),
  ]);

  // Recent contacts
  const recentContacts = await Contact.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select("name email subject status createdAt");

  // Recent projects
  const recentProjects = await Project.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select("title category status coverImage createdAt");

  res.json({
    success: true,
    data: {
      stats: {
        totalProjects,
        publishedProjects,
        totalServices,
        totalBlogs,
        publishedBlogs,
        totalTeam,
        totalContacts,
        newContacts,
        totalTestimonials,
      },
      recentContacts,
      recentProjects,
    },
  });
});

module.exports = { getDashboardStats };
