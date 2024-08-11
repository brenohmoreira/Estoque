const { sendRespost } = require("../util/exception")
const { encryptData } = require("../util/securance")
const connection = require("./../database/database")

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
        SELECT email, password 
          FROM usuario
            WHERE email = '${email}' AND password = '${password}' 
        `)      

      if(result.length == 0)
        sendRespost(res, 404, `ERROR: Credentials combination doesn't exist`, null)

      sendRespost(res, 200, `Credentials match found`, result)
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
            '${email}'
            '${password}'
          )
      `)

      const id = (await sequelize.query(`SELECT LAST_INSERT_ID() AS id`, {
        type: sequelize.QueryTypes.SELECT
      }))[0].id
      
      sendRespost(res, 200, `Account registered`, { id })
    }
    catch(err) {
      console.log(`${functionLabel} ERROR: ${err}`)

      sendRespost(res, 500, `ERROR: ` + err, null)
    }
  }
}