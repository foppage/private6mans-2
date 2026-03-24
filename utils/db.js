const mysql = require("mysql2/promise");
const config = require("../config");
module.exports = mysql.createPool({
    host:config.hostname,
    user:config.username,
    password:config.password,
    database:config.database
}); 