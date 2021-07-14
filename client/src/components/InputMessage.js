import React, { useState } from 'react'

export const InputMessage = (props) => {
    const [message, setMessage] = useState("")
    const socket = props.socket
    const onSubmitForm = e => {
        e.preventDefault();
        if (message) {
            socket.emit("message", message)
            setMessage("")
        }
    }

    return (
        <>
            <form onSubmit={onSubmitForm}>
                <input value={message} onChange={e=>setMessage(e.target.value)}/>
                <button>submit</button>
            </form>
        </>
    )
}