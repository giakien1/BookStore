const express = require("express");
const router = express.Router();
const authorController = require("../controller/authorController");
const { authenticateUser, authorizeRoles, authorizePublisher} = require("../middlewares/authMiddleware");

router.get("/", authorController.index);
router.get("/:id", authorController.getAuthorById);    

router.post("/create", authenticateUser, authorizePublisher,  authorController.createAuthor);  

router.put("/:id", authenticateUser, authorizeRoles("admin", "publisher"),  authorController.updateAuthor);   
router.delete("/:id", authenticateUser, authorizeRoles("admin", "publisher"),  authorController.deleteAuthor);  

module.exports = router;