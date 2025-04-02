const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authenticateToken"); 



router.get("/profile", authenticateToken, (req, res) => {
    res.json({ message: "Profile accessed", user: req.user });
});

module.exports = router;