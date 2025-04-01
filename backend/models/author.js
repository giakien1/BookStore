const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  bio: {
    type: String,
    default: "",
  },
  birthdate: {
    type: Date,
  },
  nationality: {
    type: String,
  },
  books: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
  }],
}, { timestamps: true });

module.exports = mongoose.model("Author", authorSchema);
