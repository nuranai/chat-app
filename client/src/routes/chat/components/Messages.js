import React, { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { socket } from '../../../service/socket'


export function Messages() {
  const token = localStorage.token

  const [valueInput, setValueInput] = useState("")
  const [messageList, setMessageList] = useState([])

  const listToScroll = useRef(null)

  const { id } = useParams()

  useEffect(() => {
    socket.emit("messages:list", { user: token, friend: id })
    //on user chat change removes previous listener and adds new one to update friends id
    socket.off('message:get')
    socket.on('message:get', (data) => {
      if (data.message.sender_name === id || data.socket_id === socket.id) {
        setMessageList(messageList => [...messageList, data.message])
        if (listToScroll.current)
          listToScroll.current.scrollTo(0, listToScroll.current.scrollHeight)
      }
    })

  }, [token, id])

  useEffect(() => {
    socket.on("messages:list", (data) => {
      setMessageList(data)
      if (listToScroll.current)
        listToScroll.current.scrollTo(0, listToScroll.current.scrollHeight)
    })
  }, [])

  useEffect(() => {
    if (!listToScroll) {
      return
    }
  }, [listToScroll])

  function SendMessage() {
    if (valueInput !== '')
      socket.emit('message:post', { text: valueInput, from: token, to: id })
    setValueInput('')
  }

  return (
    <div className="messages">
      <ul ref={listToScroll}>
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
        <input 
          value={valueInput}
          placeholder="Write Message"
          type="text"
          onChange={e => setValueInput(e.target.value)}
          onKeyPress={e => { if (e.key === 'Enter') SendMessage() }}
        />
        <button onClick={SendMessage}>{'=>'}</button>
      </div>
    </div>
  )
}