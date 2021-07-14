import React, { useState } from 'react'
import eyeSvg from './svg/eye.svg'
import invisibleSvg from './svg/invisible.svg'
import { Link } from 'react-router-dom'
import { PasswordTooltip, UserTooltip } from './components/Tooltips'
import './styles/SignUp.scss'
import './styles/Tooltip.scss'

/**
 * //TODO: tooltip+-
 * //TODO: validation+-
 * TODO: submit form to server
 * TODO: server responce
 * // TODO: style it ++-
 * //TODO: password toggle
 * //TODO: link to log in
 */

export const SignUp = () => {
  const [valueUser, setValueUser] = useState("")
  const [valueEmail, setValueEmail] = useState("")
  const [valuePass, setValuePass] = useState({ value: "", show: false })
  const [isTaken, setIsTaken] = useState({ user: false, email: false })

  const userValidation = /^[a-zA-z0-9._-]{4,32}$/,
    emailValidation = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
    passwordValidation = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])[A-Za-z0-9 !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]{8,}$/

  async function FormSubmit(e) {
    e.preventDefault()
    let inputCheck = true
    inputCheck = Validate(valueUser, userValidation) && inputCheck
    inputCheck = Validate(valueEmail, emailValidation) && inputCheck
    inputCheck = Validate(valuePass, passwordValidation) && inputCheck
    const response = await fetch('http://localhost:5000/sign-up', {
      method: "POST",
      headers: {
        'Conten-Type': 'application/json'
      },
      body: JSON.stringify({
        useranme: valueUser,
        email: valueEmail,
        password: valuePass
      })
    })
      .then(response => response.json())
      .catch(err => console.log(err))
  }

  function Validate(value, regex) {
    if (value.match(regex) === null) {
      return false
    }
    return true
  }

  return (
    <div className="wrapper">
      <h3>Sign Up</h3>
      <form onSubmit={FormSubmit}>
        <div className="input__wrapper">
          <input
            type="text"
            value={valueUser}
            onChange={e => setValueUser(e.target.value)}
            placeholder="Username"
          ></input>
          {valueUser.match(userValidation)
            ? <div className="tooltip tooltip__green"></div>
            : <div className="tooltip">!<UserTooltip /></div>}
        </div>
        {isTaken.user && <span className="taken">Username is already taken</span>}
        <div className="input__wrapper">
          <input
            type="text"
            value={valueEmail}
            onChange={e => setValueEmail(e.target.value)}
            placeholder="Email"
          ></input>
        </div>
        {isTaken.email && <span className="taken">Email is already taken</span>}
        <div className="input__wrapper">
          <input
            type={valuePass.show ? "text" : "password"}
            value={valuePass.value}
            onChange={e => setValuePass({ value: e.target.value, show: valuePass.show })}
            placeholder="Password"
          ></input>
          <img
            src={valuePass.show ? invisibleSvg : eyeSvg}
            alt="password toggle"
            onClick={e => setValuePass({ value: valuePass.value, show: !valuePass.show })}
          />
          {valuePass.value.match(passwordValidation)
            ? <div className="tooltip tooltip__green"><i className="fa fa-check"></i></div>
            : <div className="tooltip">!<PasswordTooltip /></div>}
        </div>
        <button className="submit">Submit</button>
      </form>
      <Link to="/login" className="link">Already have an account?</Link>
    </div>
  )
}

