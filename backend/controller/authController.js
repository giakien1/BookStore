const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

class AuthController {
    // [POST] /auth/register
    register = async (req, res) => {
        try {
            const { username, email, password} = req.body;
            const role = "user";

            // Kiểm tra nếu user đã tồn tại
            const existingUser = await User.findOne({ email });
            if (existingUser) return res.status(400).json({ message: "Email already exists" });

            // Tạo user mới
            const user = new User({ username, email, password, role });
            await user.save();

            res.status(201).json({ message: "User registered successfully" });
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error", error: error.message });
        }
    };

    // [POST] /auth/login
    login = async (req, res) => {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ email });
            if (!user) return res.status(400).json({ message: "Invalid email or password" });

            const isMatch = await user.comparePassword(password);
            if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

            // Tạo token JWT
            const token = jwt.sign(
                { userId: user._id.toString(), role: user.role },
                process.env.JWT_SECRET || "my_secret_key",
                { expiresIn: "7d" }
            );

            res.status(200).json({ message: "Login successful", token, role: user.role });
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error", error: error.message });
        }
    };
}

module.exports = new AuthController();
