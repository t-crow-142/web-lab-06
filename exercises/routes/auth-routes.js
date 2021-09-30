const { v4: uuid } = require("uuid");
const express = require("express");
const router = express.Router();

// The DAO that handles CRUD operations for users.
const userDao = require("../modules/users-dao.js");

// Whenever we navigate to /login, if we're already logged in, redirect to "/".
// Otherwise, render the "login" view.
router.get("/login", function (req, res) {

    if (res.locals.user) {
        res.redirect("/");
    }

    else {
        res.render("login");
    }

});

// Whenever we POST to /login, check the username and password submitted by the user.
// If they match a user in the database, give that user an authToken, save the authToken
// in a cookie, and redirect to "/". Otherwise, redirect to "/login", with a "login failed" message.
router.post("/login", async function (req, res) {

    // Get the username and password submitted in the form
    const username = req.body.username;
    const password = req.body.password;

    // Find a matching user in the database
    const user = await userDao.retrieveUserWithCredentials(username, password);

    // if there is a matching user...
    if (user) {
        // Auth success - give that user an authToken, save the token in a cookie, and redirect to the homepage.
        const authToken = uuid();
        user.authToken = authToken;
        await userDao.updateUser(user);
        res.cookie("authToken", authToken);
        res.locals.user = user;
        res.redirect("/");
    }

    // Otherwise, if there's no matching user...
    else {
        // Auth fail
        res.locals.user = null;
        res.setToastMessage("Authentication failed!");
        res.redirect("./login");
    }
});

// Whenever we navigate to /logout, delete the authToken cookie.
// redirect to "/login", supplying a "logged out successfully" message.
router.get("/logout", function (req, res) {
    res.clearCookie("authToken");
    res.locals.user = null;
    res.setToastMessage("Successfully logged out!");
    res.redirect("./login");
});

module.exports = router;