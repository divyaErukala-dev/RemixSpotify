/* eslint-disable */
import {Link} from 'react-router-dom'

import './index.css'

const NotFound = () => (
  <div className="not-found-container">
    <img
      src="https://assets.ccbp.in/frontend/react-js/spotify-remix-page-not-found.png"
      alt="page not found"
      className="not-found-image"
    />
    <h1>PAGE NOT FOUND</h1>
    <Link to="/">
      <button type="button">Home Page</button>
    </Link>
  </div>
)

export default NotFound
