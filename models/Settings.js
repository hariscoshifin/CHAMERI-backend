const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    value: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

// Helper statics
settingsSchema.statics.get = async function (key) {
  const doc = await this.findOne({ key });
  return doc ? doc.value : null;
};

settingsSchema.statics.set = async function (key, value) {
  return this.findOneAndUpdate(
    { key },
    { value },
    { upsert: true, new: true }
  );
};

module.exports = mongoose.model("Settings", settingsSchema);
