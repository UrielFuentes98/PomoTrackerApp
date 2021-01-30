const express = require("express");
const bcrypt = require("bcrypt");

const router = express.Router();
const saltRounds = 10;

const { User, Time } = require("../models");

/* Register Route
========================================================= */
router.post("/register", async (req, res) => {
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(req.body.password, salt);

  try {
    // create a new user with the password hash from bcrypt
    let user = await User.create(Object.assign(req.body, { password: hash }));

    // data will be an object with the user and it's authToken
    let tokenObj = await user.authorize();

    // send back the new user and auth token to the client
    return res.cookie("auth_token", tokenObj.token).send("User registered.");
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

/* Login Route
========================================================= */
router.post("/login", async (req, res) => {
  const { user_id, password } = req.body;

  // Bad request if username or password missing.
  if (!user_id || !password) {
    return res.status(400).send("Request missing username or password.");
  }

  try {
    const tokenObj = await User.authenticate(user_id, password);

    return res.cookie("auth_token", tokenObj.token).send("User logged in");
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

/* Logout Route
========================================================= */
router.delete("/logout", async (req, res) => {
  //Getting authToken and user data
  const { auth_token } = req.cookies;

  //Check if we have user and session token
  if (auth_token) {
    try {
      await User.logout(auth_token);
      return res.status(200).send("Session finished.");
    } catch (err) {
      return res.status(400).send(err.message);
    }
  }

  //Session not provided. Bad request.
  return res.status(400).send("No session token provided.");
});

/* Post data route
========================================================= */
router.post("/sendRecord", (req, res) => {
  const { time, pomodoro } = req.body;
  const { user } = req;
  const result = Time.updateRecord(user, time, pomodoro)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((error) => {
      res.status(400).send(error);
    });
});

// export the router so we can pass the routes to our server
module.exports = router;
