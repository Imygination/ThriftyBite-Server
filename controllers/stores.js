const { Op } = require("sequelize");
const { Store, Food, Sequelize, sequelize } = require("../models");

class Controller {
    
  static async showAllStores(req, res, next) {
    try {
      const store = await Store.findAll();
      res.status(200).json(store);
    } catch (error) {
      // console.log(error);
      next(error);
    }
  }

  static async addStore(req, res, next) {
    try {
      // console.log(req.body);
      const { name, address, latitude, longitude } = req.body;
      // console.log({
      //   longitude,
      //   latitude
      // })
      const store = await Store.create({
        name,
        address,
        location: Sequelize.fn(
          'ST_GeomFromText',
          `POINT(${longitude} ${latitude})`
        ),
        UserId: req.user.id,
      });
      res.status(201).json(store);
    } catch (error) {
      // console.log(error);
      if (error.name === "SequelizeDatabaseError") {
        res.status(400).json({message: error.message})
      } else {
        next(error);
      }
    }
  }

  static async getStoreById(req, res, next) {
    try {
      const id = req.params.id;
      const store = await Store.findByPk(id, {
        include: {
          model: Food,
        }
        })
      if (!store) {
        throw {name: "StoreNotFound"}
      }
      res.status(200).json(store);
    } catch (error) {
      // console.log(error);
      next(error);
    }
  }

  static async getStoreByLoggedInUser(req, res, next) {
    try {
      const id = req.user.id;
      const store = await Store.findOne({
        where: { 
          UserId: id
        },
        include: Food 
        });

      if (!store) {
        throw {name: "StoreNotFound"}
      }
      res.status(200).json(store);
    } catch (error) {
      // console.log(error);
      next(error);
    }
  }

  static async getStoreByProximity(req, res, next) {
    try {
      const {longitude, latitude} = req.query
      const distance = 5000
      if (!longitude || !latitude) {
        throw {name: "LongLatEmpty"}
      }
      
      const stores = await sequelize.query(
        `
        SELECT id, name, address, location, "UserId"
        FROM "Stores"
        WHERE
          ST_DWithin(
            location,
            ST_MakePoint(:long,:lat),
            :distance,
            true) = true;`,
        {
          replacements: {
            distance: +distance,
            long: parseFloat(longitude),
            lat: parseFloat(latitude),
          },
          logging: console.log,
          plain: false,
          raw: false,
          type: sequelize.QueryTypes.SELECT,
        }
      )
      
      res.status(200).json(stores)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = Controller;
