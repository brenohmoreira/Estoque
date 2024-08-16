const { sendRespost } = require("../util/exception")
const { encryptData } = require("../util/securance")
const connection = require("./../database/database")
const jwt = require("jsonwebtoken")

module.exports = {
  login: async (req, res) => {
    const functionLabel = "authenticate.login"
    const params = req.body 

    if(!params.email) { sendRespost(res, 400, `E-mail parameter not sent`, null) }
    if(!params.password) { sendRespost(res, 400, `Password parameter not sent`, null) }

    try {
      const email = params.email 
      const password = encryptData(params.password)

      const [ result ] = await connection.query(`
        SELECT id, email, password 
          FROM usuario
            WHERE email = '${email}' AND password = '${password}' 
        `)      

      if(result.length == 0)
        sendRespost(res, 404, `ERROR: Credentials combination doesn't exist`, null)

      const id = result.id 

      const token = jwt.sign({ id }, process.env.SECRET_KEY, {
        expiresIn: process.env.TIME_EXPIRE_TOKEN
      })  

      sendRespost(res, 200, `Credentials match found`, { auth: true, token })
    }
    catch(err) {
      console.log(`${functionLabel} ERROR: ${err}`)

      sendRespost(res, 500, `ERROR: ` + err, null)
    }
  },

  register: async(req, res) => {
    const functionLabel = "authenticate.register"
    const params = req.body 

    if(!params.name) { sendRespost(res, 400, `Name parameter not sent`, null) }
    if(!params.email) { sendRespost(res, 400, `E-mail parameter not sent`, null) }
    if(!params.password) { sendRespost(res, 400, `Password parameter not sent`, null) }

    try {
      const name =  params.name 
      const email = params.email 
      const password = encryptData(params.password)

      const [ result ] = await connection.query(`
        SELECT email 
          FROM usuario
            WHERE email = '${email}'
      `)

      if(result.length == 1)
        sendRespost(res, 500, `ERROR: E-mail already registered on system`, null)

      await connection.query(`
        INSERT INTO usuario (name, email, password)
          VALUES (
            '${name}',
            '${email}',
            '${password}'
          )
      `)

      const id = (await connection.query(`SELECT LAST_INSERT_ID() AS id`, {
        type: connection.QueryTypes.SELECT
      }))[0].id
      
      sendRespost(res, 200, `Account registered`, { id })
    }
    catch(err) {
      console.log(`${functionLabel} ERROR: ${err}`)

      sendRespost(res, 500, `ERROR: ` + err, null)
    }
  },

  verifyToken: async (req, res, next) => {
    const token = req.headers['authorization']

    if(!token) return sendRespost(res, 401, `No token provided`, null)

    jwt.verify(token, process.env.SECRET_KEY, function(err, decoded) {
      if (err) return sendRespost(res, 500, `Failed to authenticate token`, null)
    
      req.userId = decoded.id   
    })
    
    next()
  }
}