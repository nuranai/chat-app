const pool = require("../db")

module.exports = (io, socket) => {
  socket.on("message:first", async (data) => {
    /**
     * data strcture:
     * {
     * text: "sample text",
     * to:"usernameReceiver",
     * from:"usernameSender"
     * }
     */

    try {

      const roomName = data.from + "_" + data.to

      const res = await pool.query("INSERT INTO conversations(conversation_name) values($1) RETURNING conversation_id", [roomName])

      const userIds = await pool.query("SELECT user_id, user_name FROM users WHERE user_name IN ($1, $2)", [data.from, data.to])

      await pool.query(
        "INSERT INTO conversation_users(conversation_id, user_id, user_name) VALUES($1, $2, $3), ($1, $4, $5)",
        [res.rows[0].conversation_id, userIds.rows[0].user_id, userIds.rows[0].user_name, userIds.rows[1].user_id, userIds.rows[1].user_name]
      )

      const responce = await pool.query(
        "INSERT INTO messages(message_content, sender_id, conversation_id) VALUES ($1,$2,$3) RETURNING *",
        [data.text, data.from === userIds.rows[0].user_name ? userIds.rows[0].user_id : userIds.rows[1].user_id, res.rows[0].conversation_id]
      )
      socket.join(roomName)

      socket.to(roomName).emit("message", responce)

    } catch (error) {
      console.log(error)
    }
  })
    .on("message:post", async (data) => {
      try {

        // const userIds = await pool.query("SELECT * FROM users WHERE user_name IN ($1, $2)", [data.from, data.to])
        // const 
        const senderId = pool.query("SELECT user_id FROM users WHERE user_name = $1", [data.from])
        const conversation = await pool.query(
          `SELECT * FROM conversation_users WHERE user_name = $1 AND conversation_id IN (
            SELECT conversation_id FROM conversation_users WHERE user_name = $2
          )`,
          [data.from, data.to])

        const roomName = await pool.query(
          "SELECT * FROM conversations WHERE conversation_id = $1",
          [conversation.rows[0].conversation_id]
        )

        const message = await pool.query(
          "INSERT INTO messages(message_content, sender_id, conversation_id) VALUES ($1,$2,$3) RETURNING *",
          [data.text, senderId.rows[0].user_id, conversation.rows[0].conversation_id]
        )

        socket.to(roomName.rows[0].conversation_name).emit('message', message.rows[0])

      } catch (error) {
        console.log(error)
      }
    })
    .on("message:join-room", async (data) => {
      /**
       * data structure : 
       * {
       *  username
       * }
       */
      try {

        const roomNames = await pool.query(
          `SELECT conversation_name FROM conversations WHERE conversation_id IN (
          SELECT conversation_id FROM conversation_users WHERE user_name = $1
          )`,
          [data.username])
        roomNames.rows.map(val => socket.join(val.conversation_name))
      } catch (error) {
        console.log(error)
      }
    })
    .on("messages:list", async (data) => {
      /**
       * data structure:
       * {
       *  username:
       *  friend:
       * }
       */
      try {
        const conversation = await pool.query(
          `SELECT * FROM conversation_users WHERE user_name = $1 AND conversation_id IN (
            SELECT conversation_id FROM conversation_users WHERE user_name = $2
          )`,
          [data.from, data.friend])

        const messages = await pool.query(
          "SELECT * FROM messages WHERE conversation_id = $1",
          [conversation.rows[0].conversation_id]
        )

        socket.emit("messages:list", (messages.rows))

      } catch (error) {
        console.log(error)
      }
    })
}