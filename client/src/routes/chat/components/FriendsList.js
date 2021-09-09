import { useState, useEffect } from 'react'
import { Link, useRouteMatch } from 'react-router-dom'
import { socket } from '../../../service/socket'
import { nanoid } from 'nanoid'

export const FriendsList = ({ setToggleDropDown }) => {
  const [friends, setFriends] = useState([])
  const { url } = useRouteMatch()

  useEffect(() => {
    socket.on('users:update', () => {
      socket.emit('users:list', { token: localStorage.token })
    })
      .on('users:list', (data) => {
        setFriends(data)
        socket.emit('users:join-room', { token: localStorage.token })
      })
    socket.emit('users:list', { token: localStorage.token })
    return () => { setFriends([]); }
  }, [])


  return (
    <>
      <Link to={`/chat/search`} className="find_users">Find Users</Link>
      <ul className="users_list">
        {friends.length > 0
          ? friends.map((val) => <li key={nanoid()}>
            <Link className="user_item" onClick={() => setToggleDropDown(false)} to={url + "/" + val.user_name}>
              {val.user_name}
            <div className={`is_online ${val.is_online ? 'green' : 'gray'}`} />
            </Link>
          </li>)
          : <span className="no_users">No Users</span>}
      </ul>
    </>
  )
}