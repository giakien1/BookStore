const User = require("../models/user");

class userController {
      getUsers = async (req, res) => {
          try {
            const users = await User.find().select("-password");
            res.json(users);
          } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
          }
        };
      
      deleteUser = async (req, res) => {
        try {
          await User.findByIdAndDelete(req.params.id);
          res.json({ message: "Xóa người dùng thành công" });
        } catch (error) {
          res.status(500).json({ message: "Lỗi server", error: error.message });
        }
      };
    
      getUserById = async (req, res) => {
        try {
          const user = await User.findById(req.params.id).select("-password");
          if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });
          res.json(user);
        } catch (error) {
          res.status(500).json({ message: "Lỗi server", error: error.message });
        }
      };

      updateUser = async (req, res) => {
        try {
          const { name, email, role } = req.body;
    
          const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { name, email, role },
            { new: true, runValidators: true }
          ).select("-password");
    
          if (!updatedUser) return res.status(404).json({ message: "Không tìm thấy người dùng" });
    
          res.json({ message: "Cập nhật thành công", user: updatedUser });
        } catch (error) {
          res.status(500).json({ message: "Lỗi server", error: error.message });
        }
      };

      getCurrentUser = async (req, res) => {
        try {
            if (!req.user?.userId) {
                return res.status(400).json({ message: "Thiếu ID người dùng trong token" });
            }
    
            const user = await User.findById(req.user.userId).select("-password");
    
            if (!user) {
                return res.status(404).json({ message: "Không tìm thấy user" });
            }
    
            res.json(user);
        } catch (error) {
            console.error("Lỗi server:", error);
            res.status(500).json({ message: "Lỗi server" });
        }
    };
    
    
}

module.exports = new userController();
