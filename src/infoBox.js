import React, { Component } from 'react';
import escapeRegExp from 'escape-string-regexp'
import sortBy from 'sort-by';

import dataLocations from './locations.json'

import columns from './icon/columns.svg';
import jesus from './icon/jesus.svg';
import mole from './icon/mole-antonelliana.svg';
import palace from './icon/palace.svg';
import sarcophagus from './icon/sarcophagus.svg';

export default class InfoBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      filteredLocations: dataLocations,
      filteredMarkers: [],
      currentMarker: {}
    }
  }

  componentDidMount() {
		this.setState({
			filteredMarkers: this.props.markers
		});
	}

  updateQuery = (query) => {
    this.setState({ query })
    this.updateFilteredLocations(query)
  }

  updateFilteredLocations = (query) => {
    let self = this
    let showingLocation
    let showingMarkers

    if (query) {
      const match = new RegExp(escapeRegExp(query), 'i')

      /* Add location to the array if its title match the query */
      showingLocation = this.props.locationsList.filter((location) => match.test(location.name))

      /* Add marker to the array if its title match the query */
      showingMarkers = this.props.markers.filter(marker => match.test(marker.title))

      this.setState({
        filteredLocations: showingLocation,
        filteredMarkers: showingMarkers
      })
    } else {
      this.setState({
        filteredLocations: this.props.locationsList,
        filteredMarkers: this.props.markers
      })
    }

    /* Display the markers on the map accordingly to the state */
    this.props.markers.map(marker => marker.setVisible(false))
    setTimeout(() => {
      self.props.markers.map(marker => self.handleMarkerVisibility(marker))
    }, 1)
  }

  /* match the marker visible on the map */
  handleMarkerVisibility = (marker) => {
    this.state.filteredMarkers.map(filteredMarker =>
      filteredMarker.id === marker.id &&
      marker.setVisible(true))
  }

  manageMarker = (location) => {
    let self = this

    this.stopMarkerAnimation()
    this.startMarkerAnimation(location)
    setTimeout(() => {
      self.stopMarkerAnimation()
    }, 1250)
    this.getCurrentMarker(location)
    setTimeout(() => {
      self.props.getInfos(
        self.state.currentMarker
      )
    }, 1)
  }

  stopMarkerAnimation = () => {
    this.state.filteredMarkers.map(filteredMarker => filteredMarker.setAnimation(null))
  }

  startMarkerAnimation = (location) => {
    this.state.filteredMarkers.map(filteredMarker => filteredMarker.id === location.key && filteredMarker.setAnimation(
      window.google.maps.Animation.BOUNCE
    ))
  }

  getCurrentMarker = (location) => {
    this.state.filteredMarkers.map(filteredMarker =>
      filteredMarker.id === location.key &&
      this.setState({ currentMarker: filteredMarker })
    )
  }

  render() {
    const { query, filteredLocations } = this.state;

    const VectorIcons = {
      columns,
      jesus,
      mole,
      palace,
      sarcophagus
    }
    filteredLocations.sort(sortBy('name'))

    return (
      <aside className="infoBox">
        <header>
          <div className="menu"
            onClick={() =>
            this.updateQuery('')}
          >Reset
          </div>
          <form
            className="info-form"
            onSubmit={(event) => event.preventDefault()}
          >
          <input
            className="info-input"
            type="text"
            placeholder="Search location..."
            value={query}
            onChange = {(event) => this.updateQuery(event.target.value)}
          />
          </form>
        </header>

        <ul className="location-list">
        {
          filteredLocations.map(location => (
          <li
            tabIndex={0}
            className="location"
            key={location.key}
            onClick= {() => this.manageMarker(location)}
            onKeyPress={() =>
              this.manageMarker(location)}
          >
            <div className="location-icon">
              <img src={VectorIcons[location.icon]} alt={location.title}/>
            </div>
            <div className="location-name">
              {location.name}
            </div>
          </li>
          ))
        }
        </ul>
      </aside>
    )
  }
}
