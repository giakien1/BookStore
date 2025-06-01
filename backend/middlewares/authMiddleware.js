const jwt = require("jsonwebtoken");
const Book = require("../models/book");
const Volume = require("../models/volume");
const Author = require("../models/author");
const mongoose = require("mongoose");

    // Middleware xác thực người dùng
    const authenticateUser = async (req, res, next) => {
        const authHeader = req.header("Authorization");

        if (!authHeader) {
        return res.status(401).json({ message: "Không có quyền truy cập" });
        }
    
        const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader.split(" ")[1];
        if (!token) {
        return res.status(401).json({ message: "Bạn cần đăng nhập!" });
        }

        try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Lưu thông tin user từ token
        console.log("Decoded user:", decoded); // In ra để kiểm tra

        // Nếu role là publisher, tạo req.publisher
        if (decoded.role === "publisher" && decoded.publisherId) {
            req.publisher = { _id: decoded.publisherId };
        } else{
            req.publisher = null; 
        }
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
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return res.status(400).json({ message: "Invalid book ID" });
            }

            let book = null;

            // Tìm theo Book
            if (req.params.id) {
                book = await Book.findOne({ _id: req.params.id }).populate("publisher");
                if (!book) return res.status(404).json({ message: "Book not found" });
            }

            // Tìm theo Volume nếu chưa có book
            if (!book && req.originalUrl.includes("/volumes/")) {
                const volume = await Volume.findById(req.params.id).populate("book");
                if (!volume) return res.status(404).json({ message: "Volume not found" });

                book = await Book.findById(volume.book._id).populate("publisher");
                if (!book) return res.status(404).json({ message: "Book for volume not found" });
            }

            // Tìm theo Author nếu chưa có book
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
            if (
                req.user.role === "admin" ||
                (req.publisher && book.publisher._id.toString() === req.publisher._id.toString())
            ) {
                return next();
            }

            console.log("book.publisher:", book.publisher);
            console.log("req.publisher:", req.publisher);
            return res.status(403).json({ message: "Access Denied. You can only modify your own books" });
        } catch (error) {
            res.status(500).json({
                message: "Internal Server Error at authMiddleware",
                error: error.message,
            });
        }
    };





module.exports = { authenticateUser, authorizeRoles, authorizePublisher };
