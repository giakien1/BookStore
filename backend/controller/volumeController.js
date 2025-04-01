const mongoose = require("mongoose");
const Volume = require("../models/volume");
const Book = require("../models/book");

class VolumeController {
    //[GET] /volume
    index = async (req, res) => {
        try {
            const volumes = await Volume.find().populate("book");
            res.status(200).json(volumes);
        } catch (error) {
            console.error("Error fetching volumes:", error);
            res.status(500).json({ message: "Internal Server Error", error: error.message });
        }
    };

    //[POST] /volume/create
    createVolume = async (req, res) => {
        try {
            const { book, number, title, image, releaseDate } = req.body;
    
            if (!book || !number || !title) {
                return res.status(400).json({ message: "Missing required fields" });
            }

            // Kiểm tra ID hợp lệ
            if (!mongoose.Types.ObjectId.isValid(book)) {
                return res.status(400).json({ message: "Invalid Book ID" });
            }

            // Kiểm tra Book có tồn tại không
            const existingBook = await Book.findById(book);
            if (!existingBook) return res.status(404).json({ message: "Book not found" });

            // Tạo Volume mới
            const newVolume = new Volume({ book, number, title, image, releaseDate });
            await newVolume.save();

            // Cập nhật danh sách volumes trong Book
            existingBook.volumes.push(newVolume._id);
            await existingBook.save();

            res.status(201).json({ message: "Volume created successfully", volume: newVolume });
        } catch (error) {
            console.error("Error creating volume:", error);
            res.status(500).json({ message: "Internal Server Error", error: error.message });
        }
    };

    //[GET] /volume/:id
    getVolumeById = async (req, res) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return res.status(400).json({ message: "Invalid Volume ID" });
            }

            const volume = await Volume.findById(req.params.id).populate("book");
            if (!volume) return res.status(404).json({ message: "Volume not found" });

            res.status(200).json(volume);
        } catch (error) {
            console.error("Error fetching volume by ID:", error);
            res.status(500).json({ message: "Internal Server Error", error: error.message });
        }
    };

    //[PUT] /volume/:id
    updateVolume = async (req, res) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return res.status(400).json({ message: "Invalid Volume ID" });
            }

            const { book, number, title, image, releaseDate } = req.body;
            const volumeId = req.params.id;

            const volume = await Volume.findById(volumeId);
            if (!volume) return res.status(404).json({ message: "Volume not found" });

            let oldBookId = volume.book;

            // Nếu book thay đổi, kiểm tra ID mới có hợp lệ không
            if (book && book !== oldBookId.toString()) {
                if (!mongoose.Types.ObjectId.isValid(book)) {
                    return res.status(400).json({ message: "Invalid Book ID" });
                }

                const newBook = await Book.findById(book);
                if (!newBook) return res.status(404).json({ message: "New book not found" });

                // Cập nhật volumes trong Book cũ và mới
                await Book.findByIdAndUpdate(oldBookId, { $pull: { volumes: volumeId } });
                newBook.volumes.push(volumeId);
                await newBook.save();
            }

            // Cập nhật Volume
            const updateData = { book, number, title, image, releaseDate };
            const updatedVolume = await Volume.findByIdAndUpdate(volumeId, updateData, { new: true, runValidators: true });

            res.status(200).json({ message: "Volume updated successfully", volume: updatedVolume });
        } catch (error) {
            console.error("Error updating volume:", error);
            res.status(500).json({ message: "Internal Server Error", error: error.message });
        }
    };

    //[DELETE] /volume/:id
    deleteVolume = async (req, res) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return res.status(400).json({ message: "Invalid Volume ID" });
            }

            const volume = await Volume.findById(req.params.id);
            if (!volume) return res.status(404).json({ message: "Volume not found" });

            // Xóa Volume khỏi danh sách của Book
            await Book.findByIdAndUpdate(volume.book, { $pull: { volumes: volume._id } });

            await Volume.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: "Volume deleted successfully" });
        } catch (error) {
            console.error("Error deleting volume:", error);
            res.status(500).json({ message: "Internal Server Error", error: error.message });
        }
    };
}

module.exports = new VolumeController();
