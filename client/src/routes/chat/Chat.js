import React, { useState, useEffect } from 'react'
import {socket} from '../../service/socket'

export default function Chat({ setAuth }) {

  const [usersList, setUsersList] = useState([])

  useEffect(() => {
    socket.on('connect', () => console.log('connected'))
      .on("users:list", (data) => {
        setUsersList(data)
      })
  }, [])

  function PseudoMessage() {
    socket.emit('message:post', { text: "text", from: 'randomuser2', to: "newuser2" })
  }

  function PseudoUser() {
    socket.emit('users:list', {username: "newuser2"})
  }

  function LogOut(e) {
    e.preventDefault()
    localStorage.removeItem("token")
    setAuth(false)
  }


  return (
    <>
      <header></header>
      <button onClick={PseudoUser}>Users</button>
      <button onClick={PseudoMessage}>Logging</button>
      <button onClick={LogOut}>log out</button>
      <div className="friends"></div>
      <div className="messages"></div>
    </>)
}