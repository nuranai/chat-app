import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import { socket } from '../../../service/socket'


export const Messages = () => {
  const token = localStorage.token

  const [value, setValue] = useState("")
  const [messageList, setMessageList] = useState([])

  const { id } = useParams()

  useEffect(() => {
    socket.emit("messages:list", { user: token, friend: id })

    socket.on("messages:list", (data) => {
      setMessageList(data)
    })

  }, [token, id])

  useEffect(() => {
    socket.on('message:get', (data) => {
      if (data.from === id || data.socket_id === socket.id)
        setMessageList(messageList => [...messageList, data.message])
    })
    return () => setMessageList([])
  }, [])

  function SendMessage() {
    if (value !== '')
      socket.emit('message:post', { text: value, from: token, to: id })
    setValue('')
  }

  return (
    <div className="messages">
      <ul>
        {messageList.length > 0
          ? messageList.map((val, index) => <li key={index} className="message-block">{val.message_content}</li>)
          : <span>No Messages Yet</span>}
      </ul>
      <div>
        <input value={value}
          placeholder="Write Message"
          type="text"
          onChange={e => setValue(e.target.value)}
          onKeyPress={e => { if (e.key === 'Enter') SendMessage() }}
        />
        <button onClick={SendMessage}>Send Message</button>
      </div>
    </div>
  )
}