import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Home from './routes/Home';
import { SignUp } from './routes/auth/SignUp/SignUp';
// import { InputMessage } from './components/InputMessage';
// import { MessageList } from './components/MessageList';
// const io = require('socket.io-client')
/**
 * TODO: home page
 * TODO: login page
 * TODO: sign up page
 * TODO: 404 error page
 * TODO: chat app
 */
function App() {
  // const socket = io("http://localhost:5000")
  return (
    {/*<>
      <MessageList socket={socket}/>
      <InputMessage socket={socket}/>
    </>*/},
    <Router>
      <div>
        <Switch>
          <Route exact path="/" children={<Home/>}/>
          <Route path="/login"/>
          <Route path="/sign-up" children={<SignUp/>}/>
          <Route/>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
