const Author = require("../models/author");

class authorController{
    index = async (req, res) => {
        try {
            const authors = await Author.find();
            res.status(200).json(authors);
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error", error });
        }
    };

    createAuthor = async (req, res) => {
        try {
            const { name, bio, birthdate, nationality } = req.body;
            if (!name) {
                return res.status(400).json({ message: "Author name is required" });
            }

            const newAuthor = new Author({ name, bio, birthdate, nationality });
            await newAuthor.save();
    
            res.status(201).json({ message: "Author created successfully", author: newAuthor });
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error", error });
        }
    };

    getAuthorById = async (req, res) => {
        try {
            const author = await Author.findById(req.params.id);
            if (!author) {
                return res.status(404).json({ message: "Author not found" });
            }
            res.status(200).json(author);
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error", error });
        }
    };

    updateAuthor = async (req, res) => {
        try {
            const { name, bio, birthdate, nationality } = req.body;
            const updatedAuthor = await Author.findByIdAndUpdate(
                req.params.id,
                { name, bio, birthdate, nationality },
                { new: true }
            );
    
            if (!updatedAuthor) {
                return res.status(404).json({ message: "Author not found" });
            }
    
            res.status(200).json({ message: "Author updated successfully", author: updatedAuthor });
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error", error });
        }
    };

    deleteAuthor = async (req, res) => {
        try {
            const deletedAuthor = await Author.findByIdAndDelete(req.params.id);
            if (!deletedAuthor) {
                return res.status(404).json({ message: "Author not found" });
            }
    
            res.status(200).json({ message: "Author deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error", error });
        }
    };
}

module.exports = new authorController();