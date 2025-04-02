const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const { authenticateUser } = require("../middlewares/authMiddleware"); 

router.get("/", authenticateUser, userController.getCurrentUser);

module.exports = router;
