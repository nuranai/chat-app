import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="wrapper">
      <h4>Ples Log in / Sign up</h4>
      <Link to="/login" className="link">Log in</Link>
      <Link to="/sign-up" className="link">Sign up</Link>
    </div>
  )
}