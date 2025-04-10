const express = require("express");
const userController = require("../controller/userController");
const router = express.Router();
const { authenticateUser, authorizeRoles} = require("../middlewares/authMiddleware");

router.get("/", authenticateUser, authorizeRoles("admin"), userController.getUsers);
router.post("/create", authenticateUser, authorizeRoles("admin"), userController.createUser);
router.get("/:id", authenticateUser, authorizeRoles("admin"), userController.getUserById);
router.put("/:id", authenticateUser, authorizeRoles("admin"), userController.updateUser);
router.delete("/:id", authenticateUser, authorizeRoles("admin"), userController.deleteUser);

module.exports = router;