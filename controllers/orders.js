const {Order, FoodOrder, sequelize} = require('../models');
class Controller {
    static async createOrder(req, res, next) {
        const t = await sequelize.transaction()
        try {
            const {carts} = req.body
            const {id} = req.user
            if (!carts) {
                throw {name: "CartEmpty"}
            }

            const counts = {}
            let totalPrice = 0

            carts.forEach((el) => {
                if (!counts[el.id]) {
                    counts[el.id]= {}
                }
                counts[el.id].count = (counts[el.id].count || 0) + 1;
                counts[el.id].price = (counts[el.id].price || 0) + el.price;
                totalPrice += el.price
            })

            const order = await Order.create({
                UserId: id,
                status: "active",
                totalPrice: totalPrice
            }, {transaction: t})
            
            console.log(order)

            for (const key in counts) {
                const foodOrder = await FoodOrder.create({
                    OrderId: order.id,
                    FoodId: Number(key),
                    count: counts[key].count,
                    foodPrice: counts[key].price
                }, {transaction: t})
                console.log(foodOrder)
            }

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
}

module.exports = Controller