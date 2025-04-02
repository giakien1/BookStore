const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Book = require("../models/book");
const Volume = require("../models/volume");
const Author = require("../models/author");

    // Middleware xác thực người dùng
    const authenticateUser = async (req, res, next) => {
        const authHeader = req.header("Authorization");

        if (!authHeader) {
        return res.status(401).json({ message: "Không có quyền truy cập" });
        }
    
        const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader.split(" ")[1];
        if (!token) {
        return res.status(401).json({ message: "Token không hợp lệ" });
        }
    
        try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Lưu thông tin user từ token
        console.log("Decoded user:", decoded); // In ra để kiểm tra
        next();
        } catch (error) {
        res.status(401).json({ message: "Token không hợp lệ" });
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

const authorizePublisher = async (req, res, next) => {
    try {
        let book = null;
        // Kiểm tra nếu request liên quan đến Book
        if (req.params.id) {
            book = await Book.findById(req.params.id).populate("publisher");
            if (!book) return res.status(404).json({ message: "Book not found" });
        }

        // Kiểm tra nếu request liên quan đến Volume
        if (!book && req.originalUrl.includes("/volumes/")) {
            const volume = await Volume.findById(req.params.id).populate("book");
            if (!volume) return res.status(404).json({ message: "Volume not found" });

            book = await Book.findById(volume.book._id).populate("publisher");
            if (!book) return res.status(404).json({ message: "Book for volume not found" });
        }

        // Kiểm tra nếu request liên quan đến Author
        if (!book && req.originalUrl.includes("/authors/")) {
            const author = await Author.findById(req.params.id);
            if (!author) return res.status(404).json({ message: "Author not found" });

            book = await Book.findOne({ author: author._id }).populate("publisher");
            if (!book) return res.status(404).json({ message: "No book found for this author" });
        }

        if (!book || !book.publisher) {
            return res.status(403).json({ message: "Access Denied. You do not have permission" });
        }

        // Kiểm tra quyền
        if (req.user.role === "admin" || book.publisher._id.toString() === req.user.userId) {
            return next();
        }

        return res.status(403).json({ message: "Access Denied. You can only modify your own books" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};




module.exports = { authenticateUser, authorizeRoles, authorizePublisher };
