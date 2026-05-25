const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Note", noteSchema);
