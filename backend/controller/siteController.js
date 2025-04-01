const Book = require("../models/book")


class siteController{
    index = async (req,res) => {
        try {
            const books = await Book.find().populate("author publisher"); // Lấy dữ liệu sách cùng tác giả & NXB
            res.json(books);
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error", error: error.message });
        }
    }

    about = (req,res) => {
        return res.send("about page");
    }

    contact = (req,res) => {
        return res.send("contact page");
    }
};

module.exports = new siteController();