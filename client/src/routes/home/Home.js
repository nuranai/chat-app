import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="wrapper">
      <h4>Please Log in / Sign up to use this app</h4>
      <Link to="/login" className="link">Log in</Link>
      <Link to="/sign-up" className="link">Sign up</Link>
    </div>
  )
}