const mongoose = require("mongoose");

const publisherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  address: {
    type: String,
  },
  phone: {
    type: String,
  },
  website: {
    type: String,
  },
  establishedYear: {
    type: Number
  },
  books: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
  }],
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true } // Liên kết với tài khoản
}, { timestamps: true });

module.exports = mongoose.model("Publisher", publisherSchema);
