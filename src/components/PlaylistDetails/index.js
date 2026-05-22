/* eslint-disable */
import {Component} from 'react'

import Sidebar from '../Sidebar'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
}

class PlaylistDetails extends Component {
  state = {
    playlist: {},
    tracks: [],
    apiStatus: apiStatusConstants.initial,
    activePreviewUrl: '',
  }

  componentDidMount() {
    this.getPlaylistDetails()
  }

  onClickBack = () => {
    const {history} = this.props
    history.goBack()
  }

  onClickTrack = previewUrl => {
    this.setState({activePreviewUrl: previewUrl})
  }

  getPlaylistDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {id} = match.params
    const response = await fetch(
      `https://apis2.ccbp.in/spotify-clone/playlists-details/${id}`,
    )

    if (response.ok) {
      const data = await response.json()
      const updatedTracks = data.tracks.items.map(eachItem => ({
        id: eachItem.track.id,
        name: eachItem.track.name,
        albumName: eachItem.track.album.name,
        artistName: eachItem.track.artists[0].name,
        addedAt: eachItem.added_at,
        duration: eachItem.track.duration_ms,
        previewUrl: eachItem.track.preview_url,
      }))

      this.setState({
        playlist: {
          name: data.name,
          description: data.description,
          imageUrl: data.images[0].url,
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

  renderPlaylist = () => {
    const {playlist, tracks, activePreviewUrl} = this.state

    return (
      <>
        <button type="button" onClick={this.onClickBack}>
          Back
        </button>
        <div className="playlist-header">
          <img src={playlist.imageUrl} alt="playlist" />
          <div>
            <h1>{playlist.name}</h1>
            <p>{playlist.description}</p>
          </div>
        </div>
        <div className="tracks-heading">
          <p>Track</p>
          <p>Album</p>
          <p>Time</p>
          <p>Artist</p>
          <p>Added</p>
        </div>
        <ul className="tracks-list">
          {tracks.map(eachTrack => (
            <li
              key={eachTrack.id}
              className="track-item"
              onClick={() => this.onClickTrack(eachTrack.previewUrl)}
            >
              <p>{eachTrack.name}</p>
              <p>{eachTrack.albumName}</p>
              <p>{eachTrack.duration}</p>
              <p>{eachTrack.artistName}</p>
              <p>{eachTrack.addedAt}</p>
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
        return this.renderPlaylist()
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

export default PlaylistDetails
