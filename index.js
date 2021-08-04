const exp = require('express')
const app = exp()
const cors = require('cors')
const https = require('http')
const server = https.createServer(app)
const path = require('path')
const io = require('socket.io')(server, { 'cors': { 'origin': "*" } })
const registerMessageHandler = require('./handlers/messageHandler')
const registerUsersHandlers = require('./handlers/usersHandler')
const path = require('path/posix')
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(exp.json())

if (process.env.NODE_ENV === "production") {
  app.use(exp.static(path.join(__dirname, 'client/build')))
}

io.on('connection', (socket) => {
  // console.log(socket.id, "User connected")
  registerMessageHandler(io, socket)
  registerUsersHandlers(io, socket)
  //     socket.on('message', (msg) => {
  //         io.emit('message', msg)
  //     })
  //     socket.on("disconnect", () => {
  //         console.log("disconnected")
  //     })

})

//ROUTES

app.use('/auth', require('./routes/auth'))

app.use('/chat', require('./routes/chat'))

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})