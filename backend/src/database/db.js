require("dotenv").config()
const db = require('mysql2')
const database = {
    "host":`${process.env.server}`,
    "port":3306,
    "user":`${process.env.user}`,
    "password":`${process.env.password}`,
    "database":`${process.env.database}`
}

const connection = db.createConnection(database)

module.exports = connection