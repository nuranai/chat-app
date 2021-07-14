import { Link } from 'react-router-dom'

export default function Home() {
    return (
        <div>
            <Link to="/login">Log in</Link>
            <Link to="/sign-up">Sign up</Link>
        </div>
    )
}