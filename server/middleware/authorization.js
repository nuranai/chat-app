const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = (req, res, next) => {
  try {

    const jwtToken = req.header("jwt_token")

    // console.log(jwt_token)

    if (!jwtToken) {
      return res.status(403).json("Not Authorized")
    }

    const payload = jwt.verify(jwtToken, `${process.env.jwtSecret}`)

    req.user = payload.user

    next()
  } catch (error) {
    console.log(error)
    return res.status(401).json("Token is not valid")
  }
}