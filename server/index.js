const exp = require('express')
const app = exp()
const cors = require('cors')
const https = require('http')
const server = https.createServer(app)
const io = require('socket.io')(server, { 'cors': { 'origin': "*" } })

const users = [{ user: "helloing", email: "ll@ll", pass: "123asdASD123" }, {user:"hello", email:"dklsnv", pass:"jkdnvkj"}]

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

app.post('/sign-up', (req, res) => {
    const body = req.body
    console.log(body.user)
    let takenUser = false
    takenEmail = false
    for (let i = 0; i < users.length && (!takenUser || !takenEmail); i++) {
        if (users[i].user === body.user) {
            takenUser = true
        }
        if (users[i].email === body.email) {
            takenEmail = true
        }
    }
    const answer = { status: 400, error: { message:"username or email is already taken",taken: { user: takenUser, email: takenEmail } } }
    console.log(answer)
    // console.log(res)
    if (!takenUser && !takenEmail) {
        res.status(200).json({ status: 200 })
    }
    else { res.status(400).json(answer) }
})

server.listen(5000, () => {
    console.log("listening on port 5000")
})