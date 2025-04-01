const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    items: [
        {
            book: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
            quantity: { type: Number, required: true }
        }
    ],
    totalPrice: Number,
    status: { type: String, enum: ["pending", "shipped", "delivered"], default: "pending" }, // Trạng thái đơn hàng
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);
