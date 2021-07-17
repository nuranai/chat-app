import React, { useState } from 'react'
import '../../styles/Auth.scss'
import eyeSvg from '../svg/eye.svg'
import invisibleSvg from '../svg/invisible.svg'

export const Login = () => {
  const [valueInput, setValueInput] = useState("")
  const [valuePassword, setValuePassword] = useState("")
  const [togglePassword, setTogglePassword] = useState(true)

  async function FormSubmit() {
    await fetch('http://localhost:5000/login', {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ input: valueInput, password: valuePassword })
    })
  }

  return (
    <>
      <div>
        <form onSubmit={FormSubmit}>
          <input
            type="text"
            placeholder="Username or Email"
            value={valueInput}
            onChange={e => setValueInput(e.target.value)}
          />
          <input
            type={togglePassword ? "text" : "password"}
            placeholder="Password"
            value={valuePassword}
            onChange={e => setValuePassword(e.target.value)}
          />
          <img
            className="toggle"
            src={togglePassword ? invisibleSvg : eyeSvg}
            alt="password toggle"
            onClick={e => setTogglePassword(!togglePassword)}
          />
          <button>Submit</button>
        </form>
      </div>
    </>
  )
}