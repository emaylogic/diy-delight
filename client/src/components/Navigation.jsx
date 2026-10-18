import React from 'react'
import { Link } from 'react-router-dom'
import '../App.css'
import '../css/Navigation.css'

const Navigation = () => {
  return (
    <nav>
      <ul>
        <li>
          <h1>Build My Laptop 💻</h1>
        </li>
      </ul>

      <ul>
        <li>
          <Link to="/" role="button">
            Customize
          </Link>
        </li>
        <li>
          <Link to="/laptops" role="button">
            Saved Builds
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navigation