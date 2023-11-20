const express = require("express")
const authorization = require("../middlewares/authorization")
const authentication = require("../middlewares/authentication")
const Foods = require('../controllers/foods');
const upload = require("../middlewares/multer");
const router = express.Router()

router.get("/", Foods.getAllFoods)

router.post("/", authentication, authorization, Foods.createFood)

router.post("/images", upload.single("image"), Foods.uploadImage)

router.get("/:id", Foods.getFoodById)

router.put("/:id", authentication, authorization, Foods.editFood)

// router.delete("/:id", authentication, authorization, Foods.deleteFoodById)

module.exports = router
