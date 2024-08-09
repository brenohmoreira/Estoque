const sequelize = require("sequelize")

const connection = new sequelize(
  process.env.DATABASE_DBNAME,
  process.env.DATABASE_USERNAME,
  process.env.DATABASE_PASSWORD,
  {
    host: process.env.DATABASE_SERVER,
    port: process.env.DATABASE_PORT || 3306,
    dialect: 'mysql'
  }
)

module.exports = connection