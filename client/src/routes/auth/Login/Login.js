import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/Auth.scss'
import eyeSvg from '../svg/eye.svg'
import invisibleSvg from '../svg/invisible.svg'
import cancel from '../svg/cancel.svg'

export const Login = ({ setAuth }) => {
  const [valueEmail, setValueEmail] = useState("")
  const [valuePassword, setValuePassword] = useState("")
  const [togglePassword, setTogglePassword] = useState(false)
  const [showError, setShowError] = useState(false)

  async function FormSubmit(e) {
    try {

      e.preventDefault()

      const response = await fetch('http://localhost:5000/auth/login', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: valueEmail, password: valuePassword })
      })
      if (response.status === 200) {
        const res = await response.json()
        if (res.token) {
          localStorage.setItem("token", res.token)
          setAuth(true)
        }
        else {
          setAuth(false)
        }
      }
      else {
        setShowError(true)
      }
    } catch (error) {
      alert(error)
    }
  }


  return (
    <>
      <div className="wrapper">
        <h3>Log In</h3>
        <form onSubmit={FormSubmit}>
          <div className="input__wrapper">
            <input
              type="text"
              placeholder="Email"
              value={valueEmail}
              onChange={e => setValueEmail(e.target.value)}
              className="input_auth"
            />
          </div>
          <div className="input__wrapper">
            <input
              type={togglePassword ? "text" : "password"}
              placeholder="Password"
              value={valuePassword}
              onChange={e => setValuePassword(e.target.value)}
              className="input_auth"
            />
            <img
              className="toggle"
              src={togglePassword ? invisibleSvg : eyeSvg}
              alt="password toggle"
              onClick={e => setTogglePassword(!togglePassword)}
            />
          </div>
          <button className="submit">Submit</button>
        </form>
        <Link to="/sign-up" className="link">Don't have an account?</Link>
      </div>
      {showError && <div className="input__error" onClick={() => setShowError(false)}>Email or password are incorrect<img src={cancel} alt="close" /></div>}
    </>
  )
}