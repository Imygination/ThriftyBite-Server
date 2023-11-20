const {Order, FoodOrder, Food, sequelize} = require('../models');
const midtransClient = require("midtrans-client");
class Controller {
    static async createOrder(req, res, next) {
        const t = await sequelize.transaction()
        try {
            const data = req.body
            if (!data || data.length === 0) {
                throw {name: "CartEmpty"}
            }
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

            let snap = new midtransClient.Snap({
                isProduction: false,
                serverKey: process.env.MIDTRANS_SERVER_KEY,
            });

            let parameter = {
                transaction_details: {
                order_id: `ThriftyBite_` + order.id,
                gross_amount: order.totalPrice,
                },
                credit_card: {
                secure: true,
                },
                customer_details: {
                email: req.user.email, 
                },
            };

            const midtransResponse = await snap.createTransaction(parameter);
            const { redirect_url, token } = midtransResponse;

            res.status(201).json({ redirect_url, token });
        } catch (error) {
            await t.rollback()
            next(error)
        }
    }

    static async updateOrder(req, res, next) {
        try {
            const {transaction_status, order_id} = req.body

            if (transaction_status !== "capture") {
                throw {name: "PaymentFailed"}
            }

            const orderId = Number(order_id.split("_")[1])

            const order = await Order.findByPk(orderId, {
                include: FoodOrder
            })

            await order.update({status: "finished"})

            const foodOrder = await order.FoodOrders

            foodOrder.map(async (el) => {
                try {
                    const {count, FoodId} = el
                    const food = await Food.findByPk(FoodId)
                    const newStock = food.stock - count
                    await food.update({stock: newStock})
                } catch (error) {
                    next(error)
                }
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