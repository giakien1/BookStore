const express = require("express");
const router = express.Router();
const categoryController = require("../controller/categoryController");
const { authenticateUser, authorizeRoles} = require("../middlewares/authMiddleware");

router.get("/", authenticateUser, authorizeRoles("admin"),  categoryController.index);
router.post("/createCategory", authenticateUser, authorizeRoles("admin"),  categoryController.createCategory);

module.exports = router;