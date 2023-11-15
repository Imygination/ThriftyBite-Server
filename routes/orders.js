const express = require("express")
const authentication = require("../middlewares/authentication")
const Controller = require('../controllers/orders');
const router = express.Router()

router.post("/", authentication, Controller.createOrder)


module.exports = router