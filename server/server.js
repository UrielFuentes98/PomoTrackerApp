require("dotenv").config();
const express = require("express");

const cookieParser = require("cookie-parser");

// Requiring our models for syncing
const db = require("./models/index");
const customAuthMiddleware = require("./middleware/auth-middleware");
const userController = require("./controllers/user-controler");

// set up the Express App
const app = express();
const PORT = process.env.PORT || 8080;
app.use(express.json());
app.use(cookieParser());

app.use(customAuthMiddleware);
app.use(userController);

//Error handling
app.use((err, req, res, next) => {
  res.status(err.status);
  res.send(err.message);
});

// sync our sequelize models and then start server
db.sequelize.sync({ force: false }).then(() => {
  
  //Start server after db connection.
  app.listen(PORT, () => {
    console.log(`App listening on PORT ${PORT}`);
  });
});
