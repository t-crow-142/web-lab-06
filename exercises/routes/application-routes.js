const express = require("express");
const router = express.Router();

const { verifyAuthenticated } = require("../middleware/auth-middleware.js");

// Whenever we navigate to /, verify that we're authenticated. If we are, render the home view.
router.get("/", verifyAuthenticated, function (req, res) {

    res.render("home");
});

module.exports = router;