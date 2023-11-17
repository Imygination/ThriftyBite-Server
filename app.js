if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const cors = require("cors");
const Auth = require("./controllers/auth");
const foods = require('./routes/foods');
const orders = require('./routes/orders');
const errorHandler = require("./middlewares/errorHandler");
const stores = require("./routes/stores");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World! Final Project ThriftyBite Server");
});

//Mulai code disini
app.post("/register", Auth.addUser);
app.post("/login", Auth.loginAccount);
app.use("/foods", foods)
app.use("/orders", orders)
app.use("/stores", stores)

app.use(errorHandler);
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

module.exports = app