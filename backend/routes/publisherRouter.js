const express = require("express");
const router = express.Router();
const publisherController = require("../controller/publisherController");
const { authenticateUser, authorizeRoles } = require("../middlewares/authMiddleware");

router.get("/", publisherController.index);
router.get("/:id", publisherController.getPublisherById);

router.post("/createPublisher", authenticateUser, authorizeRoles("admin"), publisherController.createPublisher);
router.put("/:id", authenticateUser, authorizeRoles("admin"), publisherController.updatePublisher);
router.delete("/:id", authenticateUser, authorizeRoles("admin"), publisherController.deletePublisher);

module.exports = router;