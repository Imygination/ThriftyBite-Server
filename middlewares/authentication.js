const { verifyToken } = require("../helpers/jwt");
const { User } = require("../models");

async function authentication(req, res, next) {
  try {
    let load = verifyToken(req.headers.access_token);
    let user = await User.findByPk(load.id);
    req.user = { id: user.id, email: user.email, role: user.role };
    next();
  } catch (error) {
    // console.log(error)
    next(error);
  }
}

module.exports = authentication;
