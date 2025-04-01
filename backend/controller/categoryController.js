const Category = require("../models/category");

// Thêm thể loại mới
//[GET]
class categoryController{
    createCategory = async (req, res) => {
        try {
            const { name, description } = req.body;
    
            if (!name) {
                return res.status(400).json({ message: "Category name is required" });
            }
    
            // Kiểm tra xem thể loại đã tồn tại chưa
            const existingCategory = await Category.findOne({ name });
            if (existingCategory) {
                return res.status(400).json({ message: "Category already exists" });
            }
    
            // Tạo thể loại mới
            const newCategory = new Category({ name, description });
            await newCategory.save();
    
            res.status(201).json({ message: "Category created successfully", category: newCategory });
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error", error });
        }
    };
    
    // Lấy danh sách thể loại
    //[GET]
    index = async (req, res) => {
        try {
            const categories = await Category.find();
            res.status(200).json({ categories });
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error", error });
        }
    };
    
};

module.exports = new categoryController();