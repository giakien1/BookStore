const express = require("express");
const router = express.Router();
const bookController = require("../controller/bookController");
const { authenticateUser, authorizeRoles, authorizePublisher } = require("../middlewares/authMiddleware");

// Xem danh sách sách (ai cũng xem được)
router.get("/", bookController.index);
router.get("/:id", bookController.getBookById);

// Chỉ **admin** hoặc **publisher** mới có thể tạo sách
router.post("/createBook", authenticateUser, authorizeRoles("admin", "publisher"), bookController.createBook);

// Chỉ admin hoặc publisher sở hữu sách mới có thể sửa/xóa sách
router.put("/:id", authenticateUser, authorizePublisher, bookController.updateBook);
router.delete("/:id", authenticateUser, authorizePublisher, bookController.deleteBook);

module.exports = router;