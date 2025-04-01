const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "Author", required: true },
    publisher: { type: mongoose.Schema.Types.ObjectId, ref: "Publisher", required: true },
    price: { type: Number, required: true, min: 0 }, // Không cho phép giá trị âm
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    image: { type: String, required: true },
    description: { type: String, default: "" }, // Mô tả sách (Tùy chọn)
    status: { type: String, enum: ["available", "out of stock"], required: true }, // Chỉ cho phép 2 trạng thái
    volumes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Volume" }]
}, { timestamps: true });

module.exports = mongoose.model("Book", bookSchema);
