const { User, Store } = require("../models");

async function authorization(req, res, next) {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      throw { name: "UserNotFound" };
    }
    if(user.role !== "seller"){
      throw {name: "Forbidden"}
    }
    const store = await Store.findOne({
      where: {
        UserId: user.id
      }
    })

    req.user.StoreId = store.id
    console.log(req.user)
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
}

module.exports = authorization;
