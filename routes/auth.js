const router = require('express').Router()
const pool = require('../db')
const bcrypt = require("bcrypt")
const jwtGenerator = require('../utils/jwGenerator')
const authorization = require('../middleware/authorization')

function Validate(validation, input) {
  if (input.match(validation) === null) return false
  return true
}

router.post('/sign-up', async (req, res) => {
  try {

    const { username, email, password } = req.body

    const userValidation = /^[a-zA-z0-9._-]{4,32}$/,
      emailValidation = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
      passwordValidation = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])[A-Za-z0-9 !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]{8,}$/

    const validationCheck = Validate(userValidation, username) && Validate(emailValidation, email) && Validate(passwordValidation, password);

    if (validationCheck === false) {
      res.status(401).json({ error: { message: 'validation error', short: "validation" } })
    }
    else {

      const user = await pool.query("SELECT * FROM users WHERE user_name = $1 OR user_email = $2", [username, email])

      if (user.rows.length !== 0) {

        const userTaken = await pool.query("SELECT user_name FROM users WHERE user_name = $1", [username])
        const emailTaken = await pool.query("SELECT user_email FROM users WHERE user_email = $1", [email])

        res.status(401).json({
          error: {
            message: "username and/or email alerady taken",
            short: "taken",
            taken: {
              user: userTaken.rows.length > 0 ? true : false,
              email: emailTaken.rows.length > 0 ? true : false
            }
          }
        })
      }
      else {
        const salt = await bcrypt.genSalt(10)

        const bcryptPassword = await bcrypt.hash(password, salt)

        const newUser = await pool.query(
          "INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *",
          [username, email, bcryptPassword]
        )

        const token = jwtGenerator(newUser.rows[0].user_id)

        res.json({ token })
      }

    }

  } catch (error) {
    console.log(error)
    res.status(500).send("Server Error")
  }
})

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [email])

    if (user.rows.length === 0) {
      return res.status(401).json("Password or email is incorrect")
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].user_password)

    if (!validPassword) {
      return res.status(401).json("Password or email is incorrect")
    }

    const token = jwtGenerator(user.rows[0].user_id)

    res.json({ token })

  } catch (error) {
    console.log(error.message)
    res.status(500).send("Something blew up")
  }
})

router.post('/verify', authorization, async (req, res) => {
  try {

    res.json(true)

  } catch (error) {
    console.log(error.message)
    res.status(500).send("Something blew up")

  }
})

module.exports = router