import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import cancel from '../styles/cancel.svg'
import { socket } from '../../../service/socket'

export const SearchModal = ({username}) => {
  const [value, setValue] = useState("")
  const [searchFriends, setSearchFriends] = useState([])
  const history = useHistory()

  useEffect(() => {
    socket.on('users:search', (data) => {
      setSearchFriends(data)
    })
  }, [])

  function inputChange(e) {
    e.preventDefault()
    setValue(e.target.value)
    socket.emit("users:search", { value: e.target.value, token: localStorage.token })
  }

  function Close(e) {
    e.preventDefault()
    history.goBack()
  }

  function Click(e) {
    socket.emit('users:add-new', {to: e.target.innerText, sender: localStorage.token})
    history.goBack()

    history.replace(`${history.location.pathname}/${e.target.innerText}`)
  }

  return (
    <div>
      <div className="modal-content">
        <img src={cancel} alt="close" className="modal-close" onClick={Close} />
        <input type="text" placeholder="Search" value={value} onChange={inputChange} />
        <ul className="friends_list">
          {
            value === "" ? <span className="filler">Find Friends</span> :
              searchFriends.length > 0
                ? searchFriends.map((val, index) => <li key={index} className="friends_item" onClick={Click}>{val.user_name}</li>)
                : <span className="filler">Empty</span>
          }
        </ul>
      </div>
      <div className="modal-background" onClick={Close}>
      </div>
    </div>
  )
}