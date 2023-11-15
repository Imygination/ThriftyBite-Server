const express = require("express");
const authorization = require("../middlewares/authorization");
const authentication = require("../middlewares/authentication");
const Stores = require("../controllers/stores");
const router = express.Router();

router.get("/", Stores.showAllStores);
router.post("/", authentication, Stores.addStore);
router.get("/:id", Stores.getStoreById);

module.exports = router;
