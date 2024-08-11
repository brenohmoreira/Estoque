require("dotenv").config()

const express = require("express")
const connection = require("./database/database")
const bodyParser = require("body-parser")

const app = express()

app.use(bodyParser.json())

connection.authenticate().then(() => {
  console.log("The connection was a success")
  console.log("=========================================")  
}).catch((error) => {
  console.log("The connection failure: " + error)
})

/**
 * Test route
 */
app.get("/", (req, res) => {
  res.send("API ok")
})

/** 
 * Authenticate routes
**/
const authenticate = require("./controllers/authenticate")
app.get("/login", authenticate.login)

app.listen(process.env.PORT, () => {
  console.log("=========================================")
  console.log(`PORT: ${process.env.PORT}`)
  console.log("=========================================")
})