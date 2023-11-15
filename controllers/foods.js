const { Food } = require('../models');

class Controller {
    static async createFood(req, res, next) {
        try {
            const {name, imageUrl, description, price, stock,} = req.body
            const {id, StoreId} = req.user

            const food = await Food.create({
                name,
                imageUrl,
                description,
                price,
                stock,
                UserId: id,
                StoreId: StoreId
            })

            res.status(201).json(food)
        } catch (error) {
            next(error)
        }
    }

    static async getAllFoods(req, res, next) {
        try {
            const foods = await Food.findAll()

            res.status(200).json(foods)
        } catch (error) {
            next(error)
        }
    }

    static async getFoodById(req, res, next) {
        try {
            const {id} = req.params
            const food = await Food.findByPk(id)

            if (!food) {
                throw {name: "FoodNotFound"}
            }

            res.status(200).json(food)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = Controller