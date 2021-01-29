const { User, AuthToken } = require("../models");

module.exports = async function (req, res, next) {
  //Check for session token in header
  if (req.path != "/register") {
    if (req.cookies.auth_token) {
      const userData = await AuthToken.find({
        where: { token },
        include: User,
      });
      req.user = userData.User;
      next();
    } else {
      const err = new Error("Missing cookie");
      err.status = 400;
      next(err);
    }
  }
  next();
};
