const express = require("express");
const userController = require("../controller/userController");
const router = express.Router();
const { authenticateUser, authorizeRoles} = require("../middlewares/authMiddleware");

router.get("/", authenticateUser, authorizeRoles("admin"), userController.getUsers);
router.get("/:id", authenticateUser, authorizeRoles("admin"), userController.deleteUser);

module.exports = router;