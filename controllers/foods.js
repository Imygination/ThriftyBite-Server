const { Food, Store } = require('../models');
const cloudinary = require('../helpers/cloudinary');
const { Op } = require('sequelize');

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
            const {search} = req.query
            // console.log(search)
            let option = {
                include: {
                    model: Store,
                    attributes: {
                        exclude: ["createdAt", "updatedAt"]
                    }
                },
                where: {
                    stock: {
                        [Op.gt]: 0
                    }
                }
            }
            if (search) {
                option.where.name = {
                    [Op.iLike]: `%${search}%`
                }
            }
            const foods = await Food.findAll(option)

            res.status(200).json(foods)
        } catch (error) {
            next(error)
        }
    }

    static async getFoodById(req, res, next) {
        try {
            const {id} = req.params
            const food = await Food.findByPk(id, {
                include: {
                    model: Store,
                    attributes: {
                        exclude: ["createdAt", "updatedAt"]
                    }
                }
            })

            if (!food) {
                throw {name: "FoodNotFound"}
            }

            res.status(200).json(food)
        } catch (error) {
            next(error)
        }
    }


    static uploadImage(req, res) {
        // console.log("image received")
        cloudinary.uploader.upload(req.file.path, function (err, result){
            if(err) {
                console.log(err);
                return res.status(500).json({
                success: false,
                message: "Error"
                })
            }
        
            res.status(200).json(result)
        })
    }

    static async editFood(req, res, next) {
        try {
            const {id:UserId, StoreId} = req.user
            const obj = req.body
            const {id} = req.params

            const food = await Food.findByPk(id)

            if (food.UserId !== UserId || food.StoreId !== StoreId) {
                throw {name: "Forbidden"}
            }
            await food.update(obj)
            res.status(200).json({message: "Food has been updated"})
        } catch (error) {
            next(error)
        }
    }


    // Violate key value constraint. maybe don't delete for order history

    // static async deleteFoodById(req, res, next) {
    //     try {
    //         const {id} = req.params
    //         const {StoreId} = req.user
    //         const food = await Food.findByPk(id)
    //         if (food.StoreId !== StoreId) {
                
    //         }
    //         await food.destroy()
    //         res.status(200).json({message: "Food has been deleted"})
    //     } catch (error) {
    //         next(error)
    //     }
    // }
}

module.exports = Controller