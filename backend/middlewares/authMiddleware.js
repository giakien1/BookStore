const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Book = require("../models/book");
const Volume = require("../models/volume");
const Author = require("../models/author");

// Middleware xác thực người dùng
const authenticateUser = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "Access Denied. No token provided" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Lưu thông tin user từ token

        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

// Kiểm tra quyền hạn (user có phải admin hoặc publisher không)
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access Denied. Insufficient permissions" });
        }
        next();
    };
};

// Kiểm tra publisher có sở hữu **sách**, **tập sách (volume)** hoặc **tác giả** liên quan không
const authorizePublisher = async (req, res, next) => {
    try {
        let bookId = null;

        // Kiểm tra nếu request liên quan đến Book
        if (req.params.id) {
            const book = await Book.findById(req.params.id).populate("publisher");
            if (!book) return res.status(404).json({ message: "Book not found" });
            bookId = book._id;
        }

        // Kiểm tra nếu request liên quan đến Volume
        if (!bookId && req.originalUrl.includes("/volumes/")) {
            const volume = await Volume.findById(req.params.id).populate("book");
            if (!volume) return res.status(404).json({ message: "Volume not found" });
            bookId = volume.book._id;
        }

        // Kiểm tra nếu request liên quan đến Author
        if (!bookId && req.originalUrl.includes("/authors/")) {
            const author = await Author.findById(req.params.id);
            if (!author) return res.status(404).json({ message: "Author not found" });

            const book = await Book.findOne({ author: author._id });
            if (!book) return res.status(404).json({ message: "No book found for this author" });
            bookId = book._id;
        }

        if (!bookId) {
            return res.status(400).json({ message: "Invalid request" });
        }

        // Kiểm tra xem publisher có sở hữu sách đó không
        const book = await Book.findById(bookId).populate("publisher");
        if (!book) return res.status(404).json({ message: "Book not found" });

        if (req.user.role === "admin" || book.publisher.toString() === req.user.userId) {
            return next();
        }

        return res.status(403).json({ message: "Access Denied. You can only modify your own books" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

module.exports = { authenticateUser, authorizeRoles, authorizePublisher };
