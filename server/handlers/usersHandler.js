const pool = require('../db')
const jwt = require('jsonwebtoken')

module.exports = (io, socket) => {
  socket.on("users:list", async (data) => {
    /**
     * data structure:
     * {
     *  token
     * }
     */

    try {
      const users = await pool.query(
        `SELECT user_id FROM conversation_users WHERE user_id != $1 AND conversation_id IN (
          SELECT conversation_id FROM conversation_users WHERE user_id = $1
        )`, [jwt.decode(data.token).user]
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
       *  value,
       * token
       * }
       */
      try {
        const user_id = jwt.decode(data.token).user
        if (data.value !== "") {
          const usersList = await pool.query(
            "SELECT user_name FROM users WHERE LOWER(user_name) LIKE LOWER($1) AND user_id != $2",
            [data.value + '%', user_id]
          )
          socket.emit("users:search", usersList.rows)
        }
      } catch (error) {
        console.log(error)
      }
    })
    .on("users:join-room", async (data) => {
      /**
       * data structure : 
       * {
       *  token
       * }
       */
      try {
        const roomNames = await pool.query(
          `SELECT conversation_name FROM conversations WHERE conversation_id IN (
          SELECT conversation_id FROM conversation_users WHERE user_id = $1
          )`,
          [jwt.decode(data.token).user])
        roomNames.rows.map(val => socket.join(val.conversation_name))
      } catch (error) {
        console.log(error)
      }
    })
    .on("users:add-new", async (data) => {
      /**
       * data strcture:
       * {
       * to:"usernameReceiver",
       * sender: token
       * }
       */

      try {
        const sender = jwt.decode(data.sender).user

        const receiver = await pool.query('SELECT * FROM users WHERE user_name = $1', [data.to])

        const roomName = sender + "_" + receiver.rows[0].user_id

        const conversation = await pool.query("INSERT INTO conversations(conversation_name) values($1) RETURNING conversation_id", [roomName])

        await pool.query(
          "INSERT INTO conversation_users(conversation_id, user_id) VALUES($1, $2), ($1, $3)",
          [conversation.rows[0].conversation_id, sender, receiver.rows[0].user_id]
        )

        socket.join(roomName)

        socket.emit("users:update")

      } catch (error) {
        console.log(error)
      }
    })
}