const { User, AuthToken } = require("../models");

module.exports = async function (req, res, next) {
  //Check for paths that shouldn´t have requests with session tokens.
  if (req.path != "/register" && req.path != "/login") {
    //Check for session token in header
    if (req.cookies.auth_token) {
      const userData = await AuthToken.findOne({
        where: { token: req.cookies.auth_token },
        include: User,
      });
      //If token registered add user associated to the request.
      if (userData) {
        req.user = userData.User;
        next();
      } else {
        const err = new Error("No session with that token");
        err.status = 400;
        next(err);
      }
    } else {
      const err = new Error("Missing cookie");
      err.status = 400;
      next(err);
    }
  } else {
    //Check if session is not active
    if (req.cookies.auth_token) {
      const err = new Error("Session already started");
      err.status = 400;
      next(err);
    } else {
      next();
    }
  }
};
