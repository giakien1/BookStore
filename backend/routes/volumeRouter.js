const express = require("express");
const router = express.Router();
const volumeController = require("../controller/volumeController");
const { authenticateUser, authorizeRoles, authorizePublisher} = require("../middlewares/authMiddleware");

router.get("/", volumeController.index);
router.get("/:id", volumeController.getVolumeById);

router.post("/create", authenticateUser, authorizeRoles("admin", "publisher"), volumeController.createVolume);

router.put("/:id", authenticateUser, authorizePublisher, volumeController.updateVolume);
router.delete("/:id", authenticateUser, authorizePublisher, volumeController.deleteVolume);

module.exports = router;