const pool = require('../db')

module.exports = (io, socket) => {
  socket.on("users:list", async (data) => {
    /**
     * data structure:
     * {
     *  username
     * }
     */

    try {
      
      const users = await pool.query(
        `SELECT user_name FROM conversation_users WHERE user_name != $1 AND conversation_id IN (
          SELECT conversation_id FROM conversation_users WHERE user_name = $1
        )`, [data.username]
        )
      
      socket.emit("users:list", users.rows)
    } catch (error) {
      console.log(error)
    }
  })
  .on("users:search", async (data) => {
    /**
     * data structure :
     * {
     *  textField
     * }
     */
    try {
      const usersList = await pool.query("SELECT user_name FROM users WHERE user_name = $1 ORDER BY user_name LIMIT 30", [data.textField])
      socket.emit("users:search", usersList.rows)
    } catch (error) {
      console.log(error)
    }
  })
}