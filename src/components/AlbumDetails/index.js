/* eslint-disable */

import {Component} from 'react'

import Sidebar from '../Sidebar'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
}

class AlbumDetails extends Component {
  state = {
    album: {},
    tracks: [],
    apiStatus: apiStatusConstants.initial,
    activePreviewUrl: '',
  }

  componentDidMount() {
    this.getAlbumDetails()
  }

  onClickBack = () => {
    const {history} = this.props
    history.goBack()
  }

  onClickTrack = previewUrl => {
    this.setState({activePreviewUrl: previewUrl})
  }

  getAlbumDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {id} = match.params
    const response = await fetch(
      `https://apis2.ccbp.in/spotify-clone/album-details/${id}`,
    )

    if (response.ok) {
      const data = await response.json()
      const updatedTracks = data.tracks.items.map(eachItem => ({
        id: eachItem.id,
        name: eachItem.name,
        artistName: eachItem.artists[0].name,
        duration: eachItem.duration_ms,
        previewUrl: eachItem.preview_url,
      }))

      this.setState({
        album: {
          name: data.name,
          imageUrl: data.images[0].url,
          artistName: data.artists[0].name,
        },
        tracks: updatedTracks,
        apiStatus: apiStatusConstants.success,
      })
    }
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <p>Loading...</p>
    </div>
  )

  renderAlbum = () => {
    const {album, tracks, activePreviewUrl} = this.state

    return (
      <>
        <button type="button" onClick={this.onClickBack}>
          Back
        </button>
        <div className="album-header">
          <img src={album.imageUrl} alt="album" />
          <div>
            <h1>{album.name}</h1>
            <p>{album.artistName}</p>
          </div>
        </div>
        <div className="album-tracks-heading">
          <p>Track</p>
          <p>Time</p>
          <p>Artist</p>
        </div>
        <ul className="album-tracks-list">
          {tracks.map(eachTrack => (
            <li
              key={eachTrack.id}
              className="album-track-item"
              onClick={() => this.onClickTrack(eachTrack.previewUrl)}
            >
              <p>{eachTrack.name}</p>
              <p>{eachTrack.duration}</p>
              <p>{eachTrack.artistName}</p>
            </li>
          ))}
        </ul>
        {activePreviewUrl !== '' && (
          <audio src={activePreviewUrl} controls autoPlay>
            <track kind="captions" />
          </audio>
        )}
      </>
    )
  }

  renderContent = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      case apiStatusConstants.success:
        return this.renderAlbum()
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

export default AlbumDetails
