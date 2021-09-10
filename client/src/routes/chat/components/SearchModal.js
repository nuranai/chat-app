import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import cancel from '../styles/cancel.svg'
import { socket } from '../../../service/socket'

export const SearchModal = () => {
  const [searchValue, setSearchValue] = useState("")
  const [searchFriends, setSearchFriends] = useState([])
  const history = useHistory()

  useEffect(() => {
    socket.on('users:search', (data) => {
      setSearchFriends(data)
    })
  }, [])

  function inputChange(e) {
    e.preventDefault()
    setSearchValue(e.target.value)
    socket.emit("users:search", { searchValue: e.target.value, token: localStorage.token })
  }

  function CloseModal(e) {
    e.preventDefault()
    history.goBack()
  }

  function FoundUserClick(e) {
    socket.emit('users:add-new', {to: e.target.innerText, sender: localStorage.token})
    history.goBack()

    history.replace(`${history.location.pathname}/${e.target.innerText}`)
  }

  return (
    <div>
      <div className="modal-content">
        <img src={cancel} alt="close" className="modal-close" onClick={CloseModal} />
        <input type="text" placeholder="Search" value={searchValue} onChange={inputChange} />
        <ul className="friends_list">
          {
            searchValue === "" ? <span className="filler">Find Friends</span> :
              searchFriends.length > 0
                ? searchFriends.map((val, index) => <li key={index} className="friends_item" onClick={FoundUserClick}>{val.user_name}</li>)
                : <span className="filler">Empty</span>
          }
        </ul>
      </div>
      <div className="modal-background" onClick={CloseModal}>
      </div>
    </div>
  )
}