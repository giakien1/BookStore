const cartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    items: [
        {
            book: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
            quantity: { type: Number, required: true }
        }
    ]
});

module.exports = mongoose.model("Cart", cartSchema);
