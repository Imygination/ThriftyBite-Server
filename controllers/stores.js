const { Store, Food } = require("../models");

class Controller {
    
  static async showAllStores(req, res, next) {
    try {
      const store = await Store.findAll();
      res.status(200).json(store);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async addStore(req, res, next) {
    try {
      console.log(req.body);
      const { name, address, location } = req.body;
      const store = await Store.create({
        name,
        address,
        location,
        UserId: req.user.id,
      });
      res.status(201).json(store);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async getStoreById(req, res, next) {
    try {
      const id = req.params.id;
      const store = await Store.findOne({ where: { id }, include: Food });
      res.status(200).json(store);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = Controller;
