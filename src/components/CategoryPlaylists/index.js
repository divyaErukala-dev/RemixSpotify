/* eslint-disable */

import {Component} from 'react'
import {Link} from 'react-router-dom'

import Sidebar from '../Sidebar'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class CategoryPlaylists extends Component {
  state = {
    playlists: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getCategoryPlaylists()
  }

  onClickBack = () => {
    const {history} = this.props
    history.goBack()
  }

  getCategoryPlaylists = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {id} = match.params
    const response = await fetch(
      `https://apis2.ccbp.in/spotify-clone/category-playlists/${id}`,
    )

    if (response.ok) {
      const data = await response.json()
      const updatedData = data.playlists.items.map(eachItem => ({
        id: eachItem.id,
        name: eachItem.name,
        imageUrl: eachItem.images[0].url,
        total: eachItem.tracks.total,
      }))

      this.setState({
        playlists: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <p>Loading...</p>
    </div>
  )

  renderCategoryPlaylists = () => {
    const {playlists} = this.state

    return (
      <>
        <button type="button" onClick={this.onClickBack}>
          Back
        </button>
        <h1>Category Playlists</h1>
        <ul className="category-list">
          {playlists.map(eachItem => (
            <li key={eachItem.id} className="category-item">
              <Link to={`/playlist/${eachItem.id}`}>
                <img src={eachItem.imageUrl} alt={eachItem.name} />
                <p>{eachItem.name}</p>
                <p>{eachItem.total} Tracks</p>
              </Link>
            </li>
          ))}
        </ul>
      </>
    )
  }

  renderContent = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      case apiStatusConstants.success:
        return this.renderCategoryPlaylists()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="app-container">
        <Sidebar />
        <div className="details-content">{this.renderContent()}</div>
      </div>
    )
  }
}

export default CategoryPlaylists
