const Pool = require('pg').Pool

const pool = new Pool({
  user: "postgres",
  password:"dogePassword",
  host:"localhost",
  port:5432,
  database: "chatapp"
})

module.exports=pool