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
}

module.exports = new userController();
