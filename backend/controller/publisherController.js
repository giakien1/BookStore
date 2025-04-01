const Publisher = require("../models/publisher")

class publisherController{
    index = async (req,res) => {
        try {
            const publishers = await Publisher.find();
            res.status(200).json(publishers);
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error", error });
        }
    };

    createPublisher = async (req, res) => {
        try {
            const { name, address, phone, website, establishedYear } = req.body;
            const userId = req.user.userId; // Lấy ID của user từ token
    
            // Kiểm tra user có phải publisher không
            if (req.user.role !== "admin") {
                return res.status(403).json({ message: "Only admin can create publishers" });
            }
    
            const publisher = new Publisher({ name, address, phone, website, establishedYear, user: userId });
            await publisher.save();
    
            res.status(201).json({ message: "Publisher created successfully", publisher });
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error", error: error.message });
        }
    };

    getPublisherById = async (req, res) => {
        try {
            const publisher = await Publisher.findById(req.params.id);
            if (!publisher) {
                return res.status(404).json({ message: "Publisher not found" });
            }
            res.status(200).json(publisher);
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error", error });
        }
    };

    updatePublisher = async (req, res) => {
        try {
            const { name, address, phone, website, establishedYear } = req.body;
            const updatedPublisher = await Publisher.findByIdAndUpdate(
                req.params.id,
                { name, address, phone, website, establishedYear },
                { new: true, runValidators: true }
            );
    
            if (!updatedPublisher) {
                return res.status(404).json({ message: "Publisher not found" });
            }
    
            res.status(200).json({ message: "Publisher updated successfully", publisher: updatedPublisher });
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error", error });
        }
    };

    deletePublisher = async (req, res) => {
        try {
            const deletedPublisher = await Publisher.findByIdAndDelete(req.params.id);
            if (!deletedPublisher) {
                return res.status(404).json({ message: "Publisher not found" });
            }
            res.status(200).json({ message: "Publisher deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error", error });
        }
    };

};

module.exports = new publisherController();