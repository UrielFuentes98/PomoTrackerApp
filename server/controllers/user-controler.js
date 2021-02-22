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

    console.log("POST: /register. User registered.");
    // send back the new user and auth token to the client
    return res
      .status(200)
      .cookie("auth_token", tokenObj.token)
      .send("User registered.");
  } catch (error) {
    const errors = error.errors.map((err) => err.message);
    console.error("Register validation error: ", errors);
    return res.status(400).json(errors);
  }
});

/* Login Route
========================================================= */
router.post("/login", async (req, res) => {
  const { user_id, password } = req.body;
  // Bad request if username or password missing.
  if (!user_id || !password) {
    return res.status(400).send("Username or password missing.");
  }

  try {
    const tokenObject = await User.authenticate(user_id, password);
    
    console.log("POST: /login. User logged in.");
    return res.cookie("auth_token", tokenObject.token).send("User logged in");
  } catch (err) {
    console.error("Error. POST: /login.", err.message);
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

      console.log("DELETE: /logout. Session finished.");
      res.clearCookie("auth_token");
      return res.status(200).send("Session finished.");
    } catch (err) {
      console.error("Error. DELETE: /logout.", err.message);
      return res.status(400).send(err.message);
    }
  }

  console.log("Error. DELETE: /logout. No session token provided.");
  //Session not provided. Bad request.
  return res.status(400).send("No session token provided.");
});

/* Post data route
========================================================= */
router.post("/sendRecord", async (req, res) => {
  const { time, pomodoro } = req.body;
  const { user } = req;
  Time.updateRecord(user, time, pomodoro)
    .then((result) => {
      console.log("POST: /sendRecord. OK 200");
      res.status(200).send(result);
    })
    .catch((error) => {
      console.error("Error. POST /sendRecord.", error.message);
      res.status(400).send(error.message);
    });
});

router.get("/main-stats", async (req, res) => {
  try {
    let stats = await Time.getStats(req.user);
    console.log("GET: /main-stats. OK 200");
    res.status(200).json(stats);
  } catch (error) {
    console.error("Error. GET /main-stats.", error.message);
    res.status(400);
    res.send(error.message);
  }
});

// export the router so we can pass the routes to our server
module.exports = router;
