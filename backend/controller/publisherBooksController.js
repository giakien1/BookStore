const Book = require("../models/book");
const Publisher = require("../models/publisher");

class PublisherBooksController {

    // [GET] /publisher/books
    index = async (req, res) => {
        const publisher = await Publisher.findOne({ user: req.user.userId });
        if (!publisher) {
            return res.status(404).json({ message: "Publisher not found" });
        }

        const books = await Book.find({ publisher: publisher._id });
        return res.json({ books });
    };

    // [GET] /publisher/books/:id
    show = async (req, res) => {
        const book = await Book.findOne({ _id: req.params.id, user: req.user.userId });
        if (!book) return res.status(404).json({ message: "Book not found" });
      
        res.json(book);
    };

    // [POST] /publisher/createBook
    create = async (req, res) => {
        try {
            const { title, author, price, categories, image, description, status } = req.body;
    
            if (!title || !author || price === undefined || !image || !status) {
                return res.status(400).json({ message: "Missing required fields" });
            }
    
            // Kiểm tra sự tồn tại của author
            const existingAuthor = await Author.findById(author);
            if (!existingAuthor) return res.status(404).json({ message: "Author not found" });
    
            const publisherDoc = await Publisher.findOne({ user: req.user.userId });
            if (!publisherDoc) return res.status(404).json({ message: "Publisher not found" });

            // Kiểm tra sự tồn tại của categories
            const categoryIds = categories.map(category => new mongoose.Types.ObjectId(category));

            // Kiểm tra status hợp lệ
            if (!["available", "out of stock"].includes(status)) {
                return res.status(400).json({ message: "Invalid status" });
            }
    
            // Tạo sách mới
            const newBook = new Book({
                title,
                author: new mongoose.Types.ObjectId(author), // Convert author to ObjectId
                publisher: publisherDoc._id,
                price,
                categories: categoryIds,
                image,
                description,
                status,
            });
    
            await newBook.save();
    
            // Cập nhật danh sách sách của Author và Publisher
            existingAuthor.books.push(newBook._id);
            publisherDoc.books.push(newBook._id);
            await existingAuthor.save();
            await publisherDoc.save();
    
            res.status(201).json({ message: "Book created successfully", book: newBook });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal Server Error", error: error.message });
        }
    };

    // [PUT] /publisher/books/:id
    update = async (req, res) => {
        const book = await Book.findOne({ _id: req.params.id, publisher: req.user.publisherId });
        console.log("book:", book);
        if (!book) return res.status(404).json({ message: "Book not found" });
      
        Object.assign(book, req.body);
        await book.save();
        res.json(book);
    };

    // [DELETE] /publisher/books/:id
    delete = async (req, res) => {
        const result = await Book.findOneAndDelete({ _id: req.params.id, publisher: req.user.userId });
        if (!result) return res.status(404).json({ message: "Book not found" });
      
        res.json({ message: "Book deleted" });
    };
}

module.exports = new PublisherBooksController();