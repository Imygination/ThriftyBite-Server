const express = require("express")
const authentication = require("../middlewares/authentication")
const Controller = require('../controllers/orders');
const router = express.Router()

router.post("/", authentication, Controller.createOrder)

router.get("/", authentication, Controller.getAllOrder)

router.post("/payment", Controller.updateOrder)

router.get("/:id", authentication, Controller.getOrderById)

module.exports = router