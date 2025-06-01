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
  image: {
    type: String,
    default: "https://t3.ftcdn.net/jpg/05/87/76/66/360_F_587766653_PkBNyGx7mQh9l1XXPtCAq1lBgOsLl6xH.jpg", // Default image URL
  },
  books: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
  }],
}, { timestamps: true });

module.exports = mongoose.model("Author", authorSchema);
