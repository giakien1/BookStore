const mongoose = require("mongoose");

const volumeSchema = new mongoose.Schema({
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    number: { type: Number, required: true },
    title: { type: String, required: true },
    image: { type: String },
    releaseDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model("Volume", volumeSchema);
