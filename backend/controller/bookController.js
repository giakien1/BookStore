const Book = require("../models/book");
const Author = require("../models/author");
const Publisher = require("../models/publisher");

class BookController {
    // [GET] /books - Lấy danh sách sách
    index = async (req, res) => {
        try {
            const books = await Book.find().populate("author publisher categories volumes");
            res.status(200).json(books);
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error", error: error.message });
        }
    };

    // [POST] /books - Tạo sách mới
    createBook = async (req, res) => {
        try {
            const { title, author, publisher, price, categories, image, description, status, volumes } = req.body;
    
            if (!title || !author || !publisher || price === undefined || !image || !status) {
                return res.status(400).json({ message: "Missing required fields" });
            }

            const existingAuthor = await Author.findById(author);
            const existingPublisher = await Publisher.findById(publisher);
            if (!existingAuthor) return res.status(404).json({ message: "Author not found" });
            if (!existingPublisher) return res.status(404).json({ message: "Publisher not found" });

            const newBook = new Book({ title, author, publisher, price, categories, image, description, status, volumes });
            await newBook.save();

            // Cập nhật danh sách sách của Author và Publisher
            existingAuthor.books.push(newBook._id);
            existingPublisher.books.push(newBook._id);
            await existingAuthor.save();
            await existingPublisher.save();

            res.status(201).json({ message: "Book created successfully", book: newBook });
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error", error: error.message });
        }
    };

    // [GET] /books/:id - Lấy chi tiết sách
    getBookById = async (req, res) => {
        try {
            const book = await Book.findById(req.params.id)
                .populate("author", "name") // Lấy thông tin tác giả
                .populate("publisher", "name") // Lấy thông tin nhà xuất bản
                .populate("categories", "name"); // Lấy tên thể loại
            if (!book) return res.status(404).json({ message: "Book not found" });

            res.status(200).json(book);
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error", error: error.message });
        }
    };

    // [PUT] /books/:id - Cập nhật sách
    updateBook = async (req, res) => {
        try {
            const bookId = req.params.id;
            const updateData = req.body;

            const book = await Book.findByIdAndUpdate(bookId, updateData, { new: true, runValidators: true });
            if (!book) return res.status(404).json({ message: "Book not found" });

            res.status(200).json({ message: "Book updated successfully", book });
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error", error: error.message });
        }
    };

    // [DELETE] /books/:id - Xóa sách
    deleteBook = async (req, res) => {
        try {
            const book = await Book.findById(req.params.id);
            if (!book) return res.status(404).json({ message: "Book not found" });

            await Book.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: "Book deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error", error: error.message });
        }
    };
}

module.exports = new BookController();
