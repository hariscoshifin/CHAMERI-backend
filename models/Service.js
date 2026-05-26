const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true },
    shortDescription: { type: String },
    description: { type: String },
    icon: { type: String }, // Cloudinary URL or icon name
    coverImage: { type: String },
    features: [{ type: String }],
    order: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    status: { type: String, enum: ["draft", "published"], default: "published" },
  },
  { timestamps: true }
);

serviceSchema.pre("validate", function (next) {
  if (this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  next();
});

module.exports = mongoose.model("Service", serviceSchema);
