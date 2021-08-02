import { useState, useEffect } from 'react'
import { Link, useRouteMatch } from 'react-router-dom'
import { socket } from '../../../service/socket'
import { nanoid } from 'nanoid'

export const FriendsList = () => {
  const [friends, setFriends] = useState([])
  const { url } = useRouteMatch()

  

  useEffect(() => {
    socket.on('users:update', () => {
      socket.emit('users:list', { token: localStorage.token })
    })
    socket.on('users:list', (data) => {
      setFriends(data)
      socket.emit('users:join-room', { token: localStorage.token })
    })
    socket.emit('users:list', { token: localStorage.token })
    return () => {setFriends([]);}
  }, [])


  return (
    <>
      <Link to={`${url}/search`} className="find_users">Find Users</Link>
      <ul className="users_list">
        {friends.length > 0
          ? friends.map((val) => <li key={nanoid()} className="user_item"><Link to={url + "/" + val.user_name}>{val.user_name}</Link></li>)
          : <span className="no_users">No Users</span>}
      </ul>
    </>
  )
}