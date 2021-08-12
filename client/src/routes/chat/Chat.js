import { useState, useEffect } from 'react'
import { Switch, Route, useRouteMatch } from 'react-router'
import { FriendsList } from './components/FriendsList'
import { SearchModal } from './components/SearchModal'
import { Messages } from './components/Messages'
import './styles/Chat.scss'
import { socket } from '../../service/socket'

export default function Chat({ setAuth }) {

  const { path } = useRouteMatch()
  const [toggle, setToggle] = useState(false)
  const [width, setWidth] = useState(window.innerWidth)

  useEffect(() => {
    socket.connect()
    return () => socket.close()
  }, [])

  function Resize() {
    setWidth(window.innerWidth)
  }

  useEffect(() => {

    window.addEventListener("resize", Resize)
    return () => window.removeEventListener('resize', Resize)
  }, [])

  function LogOut(e) {
    e.preventDefault()
    localStorage.removeItem('token')
    setAuth(false)
  }

  function Toggle() {
    setToggle(!toggle)
  }

  return (
    <>
      <header>
        <button onClick={LogOut}>log out</button>
        {width <= 760 && <button className="ham_btn" onClick={Toggle}>Ham</button>}
      </header>

      <nav className={`friends ${width <=760 && (toggle ? "show" : "hide")}`}>
        <FriendsList setToggle={setToggle}/>
      </nav>

      <Switch>
        <Route path={`${path}/search`} component={SearchModal} />
        <Route path={`${path}/:id`} component={Messages} />
      </Switch>
    </>)
}