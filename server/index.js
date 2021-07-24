const exp = require('express')
const app = exp()
const cors = require('cors')
const https = require('http')
const server = https.createServer(app)
const io = require('socket.io')(server, { 'cors': { 'origin': "*" } })

app.use(cors())
app.use(exp.json())

io.on('connection', (socket) => {
    console.log(socket.id)
    socket.on('message', (msg) => {
        io.emit('message', msg)
    })
    socket.on("disconnect", () => {
        console.log("disconnected")
    })
})

//ROUTES

app.use('/auth', require('./routes/auth'))

app.use('/home', require('./routes/home'))

server.listen(5000, () => {
    console.log("listening on port 5000")
})