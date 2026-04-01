const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "YOUR_MYSQL_PASSWORD",
  database: "shopo",
  waitForConnections: true,
  connectionLimit: 10
});

module.exports = pool.promise();
