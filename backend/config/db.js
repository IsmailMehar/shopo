const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "ismail",
  database: "shopo",
  waitForConnections: true,
  connectionLimit: 10
});

module.exports = pool.promise();