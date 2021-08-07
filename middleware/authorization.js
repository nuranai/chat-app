const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = (req, res, next) => {
  try {

    const jwtToken = req.header("token")

    if (!jwtToken) {
      return res.status(403).json("Not Authorized")
    }
    else {

      const payload = jwt.verify(jwtToken, `${process.env.jwtSecret}`, { expiresIn: '1h' })

      req.user = payload.user

      next()
    }

  } catch (error) {
    console.log(error)
    return res.status(401).json("Token is not valid")
  }
}