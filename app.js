const express = require("express")
const cors = require('cors');
const app = express()
const port = 3000

app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.get("/", (req, res) => {
    res.send("Hello World! Final Project ThriftyBite Server")
})

//Mulai code disini

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})
