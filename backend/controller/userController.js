const User = require("../models/user");
const Publisher = require("../models/publisher");

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

      createUser = async (req, res) => {
        try {
          const { username, email, password, role } = req.body;
      
          const existingUser = await User.findOne({ email });
          if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
          }
      
          const newUser = await User.create({ username, email, password, role });
      
          if (role === "publisher") {
            try {
              const existingPublisher = await Publisher.findOne({ name: username });
              if (existingPublisher) {
                // rollback user if publisher name is taken
                await User.findByIdAndDelete(newUser._id);
                return res.status(400).json({ message: "Publisher name already in use" });
              }
      
              const newPublisher = await Publisher.create({
                name: username,
                user: newUser._id,
              });
              console.log("Publisher created:", newPublisher);
            } catch (publisherError) {
              await User.findByIdAndDelete(newUser._id);
              console.error("Error creating publisher:", publisherError);
              return res.status(500).json({ message: "Failed to create Publisher", error: publisherError.message });
            }
          }
      
          return res.status(201).json({ message: "User created", user: newUser });
        } catch (error) {
          console.error("Error creating user:", error);
          return res.status(500).json({ message: "Internal server error", error: error.message });
        }
      };
}

module.exports = new userController();
