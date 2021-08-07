const pool = require("../db")
const jwt = require('jsonwebtoken')


module.exports = (io, socket) => {
  socket.on("message:post", async (data) => {
    try {
      /**
       * data structure :
       * {
       *    text:""
       *    from: token
       *    to: username
       * }
       */
      const senderId = jwt.decode(data.from).user

      const senderName = await pool.query('SELECT user_name FROM users WHERE user_id = $1', [senderId])

      const conversation = await pool.query(
        `SELECT * FROM conversation_users WHERE user_id = $1 AND conversation_id IN (
            SELECT conversation_id FROM conversation_users WHERE user_id IN (
              SELECT user_id FROM users WHERE user_name = $2
            )
          )`,
        [senderId, data.to])

      const roomName = await pool.query(
        "SELECT * FROM conversations WHERE conversation_id = $1",
        [conversation.rows[0].conversation_id]
      )

      const message = await pool.query(
        "INSERT INTO messages(message_content, sender_id, sender_name, conversation_id) VALUES ($1,$2,$3,$4) RETURNING message_content, sender_name",
        [data.text, senderId, senderName.rows[0].user_name, conversation.rows[0].conversation_id]
      )

      console.log(data)


      io.in(roomName.rows[0].conversation_name).emit('message:get', {
        message: message.rows[0],
        // from: senderName.rows[0].user_name,
        socket_id: socket.id
      })


    } catch (error) {
      console.log(error)
    }
  })
    .on("messages:list", async (data) => {
      /**
       * data structure:
       * {
       *  user:
       *  friend:
       * }
       */
      try {
        const conversation = await pool.query(
          `SELECT conversation_id FROM conversation_users WHERE user_id = $1 AND conversation_id IN (
            SELECT conversation_id FROM conversation_users WHERE user_id IN (
              SELECT user_id FROM users WHERE user_name = $2
            )
          )`,
          [jwt.decode(data.user).user, data.friend])

        const messages = await pool.query(
          "SELECT message_content, sender_name FROM messages WHERE conversation_id = $1",
          [conversation.rows[0].conversation_id]
        )

        socket.emit("messages:list", messages.rows)

      } catch (error) {
        console.log(error)
      }
    })
}