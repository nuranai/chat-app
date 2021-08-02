import { useEffect } from 'react'
import { Switch, Route, useRouteMatch } from 'react-router'
import { FriendsList } from './components/FriendsList'
import { SearchModal } from './components/SearchModal'
import { Messages } from './components/Messages'
import './styles/Chat.scss'
import { socket } from '../../service/socket'

export default function Chat({ setAuth }) {

  // const [usersList, setUsersList] = useState([])

  // useEffect(() => {
  //   socket.on("users:list", (data) => {
  //     setUsersList(data)
  //   })
  // }, [])
  const { path } = useRouteMatch()

  useEffect(() => {
    socket.connect()
    return () => socket.close()
  }, [])

  function LogOut(e) {
    e.preventDefault()
    localStorage.removeItem('token')
    setAuth(false)
  }


  return (
    <>
      <header>
        <button onClick={LogOut}>log out</button>

      </header>

      <nav className="friends">
        <FriendsList />
      </nav>

      <Switch>
        <Route path={`${path}/search`} component={SearchModal} />
        <Route path={`${path}/:id`} component={Messages} />
      </Switch>
    </>)
}