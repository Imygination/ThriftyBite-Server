const {Order, FoodOrder, Food, sequelize} = require('../models');
class Controller {
    static async createOrder(req, res, next) {
        const t = await sequelize.transaction()
        try {
            const data = req.body
            const {id} = req.user
            let totalPrice = 0
            data.map((el) => {
                totalPrice += el.price
            })

            
            
            const order = await Order.create({
                    UserId: id,
                    status: "active",
                    totalPrice, totalPrice
                }, {transaction: t})

                const cart = data.map((el) => {
                    return {
                        OrderId: order.id,
                        FoodId: el.foodId,
                        foodPrice: el.price,
                        count: el.count
                    }
                })
            const foodOrder = await FoodOrder.bulkCreate(cart,{
                transaction: t
            })
            await t.commit()
            res.status(201).json({message: "Order created"})
        } catch (error) {
            next(error)
            await t.rollback()
        }
    }

    static async updateOrder(req, res, next) {
        try {
            const {id} = req.params
            const {status} = req.body

            if (!status) {
                throw {name: "StatusEmpty"}
            }

            const order = await Order.findByPk(id)

            if (!order) {
                throw {name: "OrderNotFound"}
            }

            await order.update({
                status: status
            })

            res.status(200).json({message: "Order has been updated"})
        } catch (error) {
            next(error)
        }
    }

    static async getOrderById(req, res, next) {
        try {
            const {id} = req.params
            const {id:userId} = req.user

            const order = await Order.findByPk(id, {
                include: {
                    association: "FoodOrders",
                    attributes: {
                        exclude: ["createdAt", "updatedAt"]
                    },
                    include: {
                        association: "Food",
                        attributes: ["name"]
                    }
                }
            })

            if (!order) {
                throw {name: "OrderNotFound"}
            }
            if (userId !== order.UserId) {
                throw {name: "Unauthenticated"}
            }

            res.status(200).json(order)
        } catch (error) {
            next(error)
        }
    }

    static async getAllOrder(req, res, next) {
        try {
            const {id} = req.user
            const orders = await Order.findAll({
                where: {
                    UserId: id
                },
                include: {
                    association: "FoodOrders",
                    attributes: {
                        exclude: ["createdAt", "updatedAt"]
                    },
                    include: {
                        association: "Food",
                        attributes: ["name"]
                    }
                }
            })

            if (!orders) {
                throw {name: "OrderNotFound"}
            }
            res.status(200).json(orders)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = Controller