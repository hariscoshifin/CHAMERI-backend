const mongoose = require("mongoose");

const teamMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    designation: { type: String, required: true },
    bio: { type: String },
    image: { type: String, required: true },
    socialLinks: {
      linkedin: { type: String },
      instagram: { type: String },
      twitter: { type: String },
    },
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TeamMember", teamMemberSchema);
