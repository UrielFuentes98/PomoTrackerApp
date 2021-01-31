require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cookieParser = require("cookie-parser");
// Requiring our models for syncing
const db = require("./models/index");
const customAuthMiddleware = require("./middleware/auth-middleware");
const userController = require("./controllers/user-controler");
// set up the Express App
const app = express();
const PORT = process.env.PORT || 8080;
// Express middleware that allows POSTing data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
// Static files
app.use(express.static("build"));
app.use(customAuthMiddleware);
app.use(userController);
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});

// serve up the public folder so we can request static
// assets from the client
// app.use(express.static(`${clientDir}/public`));
// start the express server
app.use((err, req, res, next) => {
  res.status(err.status);
  res.send(err.message);
});
// sync our sequelize models and then start server
// force: true will wipe our database on each server restart
// this is ideal while we change the models around
db.sequelize.sync({ force: false }).then(() => {
  // inside our db sync callback, we start the server
  // this is our way of making sure the server is not listening
  // to requests if we have not made a db connection
  app.listen(PORT, () => {
    console.log(`App listening on PORT ${PORT}`);
  });
});
