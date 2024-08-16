require("dotenv").config()

const express = require("express")
const connection = require("./database/database")
const bodyParser = require("body-parser")
const jwtoken = require("jsonwebtoken")
const cors = require("cors")

const app = express()

app.use(bodyParser.json())
app.use(cors())

connection.authenticate().then(() => {
  console.log("The connection was a success")
  console.log("=========================================")  
}).catch((error) => {
  console.log("The connection failure: " + error)
})

/**
 * Controllers
 */
const authenticate = require("./controllers/authenticate")

/**
 * Test routes
 */
app.get("/api", (req, res) => {
  res.send("API ok")
})
app.get("/api/permission", authenticate.verifyToken, (req, res) => {
  res.send("ENTROU!")
})

/** 
 * Authenticate routes
**/
app.post("/api/login", authenticate.login)
app.post("/api/register", authenticate.register)


app.listen(process.env.PORT, () => {
  console.log("=========================================")
  console.log(`PORT: ${process.env.PORT}`)
  console.log("=========================================")
})