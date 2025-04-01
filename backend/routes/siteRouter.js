const express = require("express");
const router = express.Router();
const siteController = require("../controller/siteController");

router.get("/", siteController.index);
router.get("/contact", siteController.contact);
router.get("/about", siteController.about);

module.exports = router;