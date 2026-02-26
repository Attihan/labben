import { Link } from 'react-router-dom'
import '../../styles/components/navbar.css'

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbarcontainer">
        <Link to="/" className="navbarlogo">
          <span className="navbarlogo-text">Labben</span>
        </Link>

        <ul className="navbarmenu">
          <li className="navbaritem">
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
