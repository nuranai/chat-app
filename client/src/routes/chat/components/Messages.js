import React, { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { socket } from '../../../service/socket'


export function Messages() {
  const token = localStorage.token

  // const audio = new Audio('../me-too-603.wav')

  const [value, setValue] = useState("")
  const [messageList, setMessageList] = useState([])

  const elemToScroll = useRef(null)

  const { id } = useParams()

  useEffect(() => {
    socket.emit("messages:list", { user: token, friend: id })

    socket.off('message:get')
    socket.on('message:get', (data) => {
      if (data.message.sender_name === id || data.socket_id === socket.id) {
        setMessageList(messageList => [...messageList, data.message])
        if (elemToScroll.current)
          elemToScroll.current.scrollTo(0, elemToScroll.current.scrollHeight)
      }
    })

  }, [token, id])

  useEffect(() => {
    socket.on("messages:list", (data) => {
      setMessageList(data)
      if (elemToScroll.current)
        elemToScroll.current.scrollTo(0, elemToScroll.current.scrollHeight)
    })
  }, [])

  useEffect(() => {
    if (!elemToScroll) {
      return
    }
  }, [elemToScroll])

  function SendMessage() {
    if (value !== '')
      socket.emit('message:post', { text: value, from: token, to: id })
    setValue('')
  }

  return (
    <div className="messages">
      <ul ref={elemToScroll}>
        {messageList.length > 0
          ? messageList.map((val, index) => <li
            key={index}
            className={`message-block ${val.sender_name === id
              ? null
              : "my"
              }`}
          >{val.message_content}</li>)
          : <span className="message_filler">No Messages Yet</span>}
      </ul>
      <div className="send_message">
        <input value={value}
          placeholder="Write Message"
          type="text"
          onChange={e => setValue(e.target.value)}
          onKeyPress={e => { if (e.key === 'Enter') SendMessage() }}
        />
        <button onClick={SendMessage}>{'=>'}</button>
      </div>
    </div>
  )
}