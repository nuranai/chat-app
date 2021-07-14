import React, { useState } from 'react'
import { nanoid } from 'nanoid'

export const MessageList = (props) => {
    const [messageList, setMessageList] = useState([{message: "hello"}, {message: "yes"}])
    const socket = props.socket;
    socket.on('message', (message)=>{
        const newMessageList = [...messageList, {message}]
        setMessageList(newMessageList)
        console.log(messageList)
    })

    return (
        <ul>
            {
                messageList.map((m) =>
                    <li key={nanoid(5)}>{m.message}</li>
                )
            }
        </ul>
    )
}