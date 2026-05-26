const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    clientName: { type: String, required: true },
    clientCompany: { type: String },
    clientDesignation: { type: String },
    clientImage: { type: String },
    review: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    projectRef: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Testimonial", testimonialSchema);
