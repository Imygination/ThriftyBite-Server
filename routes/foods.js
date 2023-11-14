const express = require("express")
const authorization = require("../middlewares/authorization")
const authentication = require("../middlewares/authentication")
const Foods = require('../controllers/foods');
const router = express.Router()

router.get("/", Foods.getAllFoods)

router.post("/", authentication, authorization, Foods.createFood)

router.get("/:id", Foods.getFoodById)

module.exports = router
