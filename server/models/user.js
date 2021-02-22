const bcrypt = require("bcrypt");
const { Op } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { timestamps: false }
  );

  // set up the associations so we can make queries that include
  // the related objects
  User.associate = function ({ Time, AuthToken }) {
    User.hasMany(AuthToken);
    User.hasMany(Time);
  };

  //Look if password recieved matches one stored in datase.
  User.authenticate = async function (user_id, password) {
    const user = await User.findOne({
      where: { [Op.or]: [{ username: user_id }, { email: user_id }] },
    });

    if (user) {
      if (bcrypt.compareSync(password, user.password)) {
        //If correct password generate session token.
        return user.authorize();
      }
      throw new Error("Invalid password.");
    }
    throw new Error("User doesnt exist.");
  };

  //Generate token and associate it with user.
  User.prototype.authorize = async function () {
    const { AuthToken } = sequelize.models;
    const user = this;

    const authToken = await AuthToken.generate(this.id);

    await user.addAuthToken(authToken);

    return authToken;
  };

  User.logout = async function (token) {
    // destroy the auth token record that matches the passed token
    const numDeleted = await sequelize.models.AuthToken.destroy({
      where: { token },
    });
    if (numDeleted == 0) {
      throw new Error("No token session to delete for user.");
    }
  };

  return User;
};
