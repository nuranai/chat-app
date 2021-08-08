import { Link } from 'react-router-dom'
import './NotFound.scss'

export const NotFound = () => {
  return (
    <div className="not_found_container">
      <h1>404 Not Found</h1>
      <p>You picked the wrong house fool</p>
      <Link className="not_found_link" to="/chat">Back to chat</Link>
      {/* <Link className="not_found_link" to="/">Or to Home page</Link> */}
    </div>
  )
}