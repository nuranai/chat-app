const pool = require("../db")

module.exports = (io, socket) => {
  socket.on("message:post", async (data) => {
      try {

        // const userIds = await pool.query("SELECT * FROM users WHERE user_name IN ($1, $2)", [data.from, data.to])
        // const 
        const senderId = jwt.decode(data.from).user

        const conversation = await pool.query(
          `SELECT * FROM conversation_users WHERE user_id = $1 AND conversation_id IN (
            SELECT conversation_id FROM conversation_users WHERE user_name = $2
          )`,
          [senderId, data.to])

        const roomName = await pool.query(
          "SELECT * FROM conversations WHERE conversation_id = $1",
          [conversation.rows[0].conversation_id]
        )

        const message = await pool.query(
          "INSERT INTO messages(message_content, sender_id, conversation_id) VALUES ($1,$2,$3) RETURNING message_content",
          [data.text, senderId, conversation.rows[0].conversation_id]
        )
        console.log(socket.id, roomName.rows[0].conversation_name)
        io.in(roomName.rows[0].conversation_name).emit('message:get', message.rows[0])


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
          `SELECT conversation_id FROM conversation_users WHERE user_name = $1 AND conversation_id IN (
            SELECT conversation_id FROM conversation_users WHERE user_name = $2
          )`,
          [jwt.decode(data.user).user, data.friend])
          
        const messages = await pool.query(
          "SELECT message_content FROM messages WHERE conversation_id = $1",
          [conversation.rows[0].conversation_id]
        )

        socket.emit("messages:list", messages.rows)

      } catch (error) {
        console.log(error)
      }
    })
}