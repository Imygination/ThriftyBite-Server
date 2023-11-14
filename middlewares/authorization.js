const { User } = require("../models");

async function authorization(req, res, next) {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      throw { name: "UserNotFound" };
    }
    if(user.role !== "seller"){
      throw {name: "Forbidden"}
    }
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
}

module.exports = authorization;
