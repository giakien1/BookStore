const express = require("express");
const router = express.Router();
const categoryController = require("../controller/categoryController");
const { authenticateUser, authorizeRoles} = require("../middlewares/authMiddleware");

router.get("/", authenticateUser, authorizeRoles("admin", "publisher"),  categoryController.index);
router.post("/create", authenticateUser, authorizeRoles("admin"),  categoryController.createCategory);
router.delete("/:id", authenticateUser, authorizeRoles("admin"),  categoryController.deleteCategory);

module.exports = router;