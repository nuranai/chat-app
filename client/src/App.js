import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom'
import Home from './routes/Home';
import Chat from './routes/chat/Chat';
import { SignUp } from './routes/auth/SignUp/SignUp';
import { Login } from './routes/auth/Login/Login';
// import { InputMessage } from './components/InputMessage';
// import { MessageList } from './components/MessageList';
// const io = require('socket.io-client')
/**
 * TODO: home page
 * //TODO: login page
 * //TODO: sign up page
 * TODO: 404 error page
 * TODO: chat app
 */
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const setAuth = (b) => {
    setIsAuthenticated(b)
  }

  const checkAuthentication = async () => {
    fetch('http://localhost:5000/auth/verify', {
      method: "POST",
      headers: { "jwt_token": localStorage.jwt_token }
    })
      .then(res => res.json())
      .then(res => {res === true ? setIsAuthenticated(true) : setIsAuthenticated(false)})
      .catch(err => console.error(err.message))
  }

  useEffect(() => {
    checkAuthentication()
  }, [])

  return (
    <Router>
      <div>
        <Switch>
          <Route
            exact
            path="/"
            children={<Home />}
          />
          <Route
            path="/login"
            render={props => !isAuthenticated ? <Login {...props} setAuth={setAuth} /> : <Redirect to="/chat" />}
          />
          <Route
            path="/sign-up"
            render={props => !isAuthenticated ? <SignUp {...props} setAuth={setAuth} /> : <Redirect to="/chat" />}
          />
          <Route
            path="/chat"
            render={props => isAuthenticated ? <Chat {...props} setAuth={setAuth} /> : <Redirect to="/login" />}
          />
          <Route />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
