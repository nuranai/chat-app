const exp = require('express')
const app = exp()
const cors = require('cors')
const https = require('http')
const server = https.createServer(app)
const io =  require('socket.io')(server,{ 'cors': { 'origin': "*"}})

io.on('connection', (socket) => {
    console.log(socket.id)
    socket.on('message', (msg)=> {
        io.emit('message', msg)
    })
    socket.on("disconnect", ()=> {
        console.log("disconnected")
    })
})

server.listen(5000, () => {
    console.log("listening on port 5000")
})