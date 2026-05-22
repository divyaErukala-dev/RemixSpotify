/* eslint-disable */
import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

const Sidebar = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <div className="sidebar-container">
      <ul className="sidebar-list">
        <li>
          <Link to="/">
            <img
              src="https://assets.ccbp.in/frontend/react-js/spotify-remix-logo.png"
              alt="website logo"
              className="website-logo"
            />
          </Link>
        </li>
        <li>
          <button
            type="button"
            className="logout-button"
            onClick={onClickLogout}
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  )
}

export default withRouter(Sidebar)
