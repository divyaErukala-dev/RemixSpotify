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

class Home extends Component {
  state = {
    featuredPlaylists: [],
    categories: [],
    newReleases: [],
    featuredStatus: apiStatusConstants.initial,
    categoriesStatus: apiStatusConstants.initial,
    newReleasesStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getFeaturedPlaylists()
    this.getCategories()
    this.getNewReleases()
  }

  getFeaturedPlaylists = async () => {
    this.setState({featuredStatus: apiStatusConstants.inProgress})
    const response = await fetch(
      'https://apis2.ccbp.in/spotify-clone/featured-playlists',
    )

    if (response.ok) {
      const data = await response.json()
      const updatedData = data.playlists.items.map(eachItem => ({
        id: eachItem.id,
        name: eachItem.name,
        imageUrl: eachItem.images[0].url,
      }))
      this.setState({
        featuredPlaylists: updatedData,
        featuredStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({featuredStatus: apiStatusConstants.failure})
    }
  }

  getCategories = async () => {
    this.setState({categoriesStatus: apiStatusConstants.inProgress})
    const response = await fetch(
      'https://apis2.ccbp.in/spotify-clone/categories',
    )

    if (response.ok) {
      const data = await response.json()
      const updatedData = data.categories.items.map(eachItem => ({
        id: eachItem.id,
        name: eachItem.name,
        imageUrl: eachItem.icons[0].url,
      }))
      this.setState({
        categories: updatedData,
        categoriesStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({categoriesStatus: apiStatusConstants.failure})
    }
  }

  getNewReleases = async () => {
    this.setState({newReleasesStatus: apiStatusConstants.inProgress})
    const response = await fetch(
      'https://apis2.ccbp.in/spotify-clone/new-releases',
    )

    if (response.ok) {
      const data = await response.json()
      const updatedData = data.albums.items.map(eachItem => ({
        id: eachItem.id,
        name: eachItem.name,
        imageUrl: eachItem.images[0].url,
      }))
      this.setState({
        newReleases: updatedData,
        newReleasesStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({newReleasesStatus: apiStatusConstants.failure})
    }
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <p>Loading...</p>
    </div>
  )

  renderFailureView = retryFunction => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/spotify-remix-failure-view.png"
        alt="failure view"
        className="failure-view-image"
      />
      <p>Something went wrong. Please try again</p>
      <button type="button" onClick={retryFunction}>
        Try again
      </button>
    </div>
  )

  renderCard = (item, altText, path) => (
    <li className="music-card" key={item.id}>
      <Link to={path}>
        <img src={item.imageUrl} alt={altText} className="music-image" />
      </Link>
      <p className="music-name">{item.name}</p>
    </li>
  )

  renderFeaturedPlaylists = () => {
    const {featuredPlaylists} = this.state

    return (
      <ul className="music-list">
        {featuredPlaylists.map(eachItem =>
          this.renderCard(
            eachItem,
            'featured playlist',
            `/playlist/${eachItem.id}`,
          ),
        )}
      </ul>
    )
  }

  renderCategories = () => {
    const {categories} = this.state

    return (
      <ul className="music-list">
        {categories.map(eachItem =>
          this.renderCard(
            eachItem,
            'category',
            `/category/${eachItem.id}/playlists`,
          ),
        )}
      </ul>
    )
  }

  renderNewReleases = () => {
    const {newReleases} = this.state

    return (
      <ul className="music-list">
        {newReleases.map(eachItem =>
          this.renderCard(
            eachItem,
            'new release album',
            `/album/${eachItem.id}`,
          ),
        )}
      </ul>
    )
  }

  renderSectionContent = (status, successView, retryFunction) => {
    switch (status) {
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      case apiStatusConstants.success:
        return successView()
      case apiStatusConstants.failure:
        return this.renderFailureView(retryFunction)
      default:
        return null
    }
  }

  render() {
    const {featuredStatus, categoriesStatus, newReleasesStatus} = this.state

    return (
      <div className="app-container">
        <Sidebar />
        <div className="home-content">
          <div>
            <h1>Editors Picks</h1>
            {this.renderSectionContent(
              featuredStatus,
              this.renderFeaturedPlaylists,
              this.getFeaturedPlaylists,
            )}
          </div>

          <div>
            <h1>Genres & Moods</h1>
            {this.renderSectionContent(
              categoriesStatus,
              this.renderCategories,
              this.getCategories,
            )}
          </div>

          <div>
            <h1>New Releases</h1>
            {this.renderSectionContent(
              newReleasesStatus,
              this.renderNewReleases,
              this.getNewReleases,
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default Home
