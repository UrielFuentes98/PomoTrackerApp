require("dotenv").config();
const express = require("express");
var cors = require("cors");
const cookieParser = require("cookie-parser");

const db = require("./models/index");
const customAuthMiddleware = require("./middleware/auth-middleware");
const userController = require("./controllers/user-controler");

//CORS
let corsOptions = {
  origin: "https://urielfuentes98.github.io",
  methods: ["GET", "POST", "DELETE", "OPTIONS"],
  credentials: true
};

// set up the Express App server
const app = express();
app.use(cors(corsOptions));
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

// sync sequelize models and then start server
db.sequelize.sync({ force: false }).then(() => {
  //Start server after db connection.
  app.listen(PORT, () => {
    console.log(`App listening on PORT ${PORT}`);
  });
});
