const express = require("express");
const router = express.Router();
const publisherBooksController = require("../controller/publisherBooksController");
const { authenticateUser, authorizePublisher, authorizeRoles } = require("../middlewares/authMiddleware");

router.get("/", authenticateUser, authorizeRoles("publisher"), publisherBooksController.index); // Get all books for the publisher
router.post("/create", authenticateUser, authorizePublisher, publisherBooksController.create); // Create a new book
router.put("/:id", authenticateUser, authorizePublisher, publisherBooksController.update); // Update a book by ID
router.delete("/:id", authenticateUser, authorizePublisher, publisherBooksController.delete); // Delete a book by ID

module.exports = router;