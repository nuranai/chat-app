const exp = require('express'),
  app = exp(),
  cors = require('cors'),
  https = require('http'),
  server = https.createServer(app),
  path = require('path'),
  io = require('socket.io')(server, { 'cors': { 'origin': "*" } }),
  registerMessageHandler = require('./handlers/messageHandler'),
  registerUsersHandlers = require('./handlers/usersHandler'),
  pool = require('./db')

const PORT = process.env.PORT || 5000

app.use(cors())
app.use(exp.json())

if (process.env.NODE_ENV === "production") {
  app.use(exp.static(path.join(__dirname, 'client/build')))
}

io.on('connection', (socket) => {
  registerMessageHandler(io, socket)
  registerUsersHandlers(io, socket)
  socket.on('disconnecting', async (reason) => {
    try {
      const userId = await pool.query(
        "UPDATE users SET latest_socket_id = NULL WHERE latest_socket_id = $1 RETURNING *",
        [socket.id]
      )

      const sockets = await pool.query(`SELECT latest_socket_id FROM users WHERE user_id IN (
        SELECT user_id FROM conversation_users WHERE conversation_id IN (
          SELECT conversation_id FROM conversation_users WHERE user_id = $1
        )
      )`, [userId.rows[0].user_id])
      sockets.rows.map(val => io.to(val.latest_socket_id).emit('users:update'))
    } catch (error) {
      console.log(error)
    }
  })
})

//ROUTES

app.use('/auth', require('./routes/auth'))

// app.use('/chat', require('./routes/chat'))

app.get('*', (req, res) => res.sendFile(path.resolve(path.join(__dirname, 'client/build'), 'index.html')))

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})