const { comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { User } = require("../models");

class Controller {
  static async loginAccount(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email) {
        throw { name: "EmailNull" };
      }
      if (!password) {
        throw { name: "PasswordNull" };
      }
      const user = await User.findOne({
        where: { email },
      });
      if (!user) {
        throw { name: "UserNotFound" };
      }
      const passwordValid = comparePassword(password, user.password);
      if (!passwordValid) {
        throw { name: "PasswordInvalid" };
      }
      // console.log(user);
      const token = signToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });
      
      res.status(200).json({ access_token: token });
    } catch (error) {
      // console.log(error);
      next(error);
    }
  }

  static async addUser(req, res, next) {
    try {
      const { username, email, password, phoneNumber, address, role } = req.body;
      const user = await User.create({
        username,
        email,
        password,
        role,
        phoneNumber,
        address,
      });
      res.status(201).json({
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = Controller;
