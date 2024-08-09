require("dotenv").config()

const express = require("express")
const connection = require("./database/database")
const bodyParser = require("body-parser")

const app = express()

connection.authenticate().then(() => {
  console.log("The connection was a success")
  console.log("=========================================")  
}).catch((error) => {
  console.log("The connection failure: " + error)
})

app.listen(process.env.PORT, () => {
  console.log("=========================================")
  console.log(`PORT: ${process.env.PORT}`)
  console.log("=========================================")
})