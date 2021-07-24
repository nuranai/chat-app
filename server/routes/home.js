const router = require('express').Router()
const authorization = require('../middleware/authorization')
const pool = require('../db')

router.get("/", authorization, async (req, res) => {
  try {
    const user = await pool.query("SELECT user_name FROM users WHERE user_id = $1", [req.user])

    res.json(user.rows[0])
  } catch (error) {
    console.log(error)
    res.status(500).send("something blew up")
  }
})

module.exports = router