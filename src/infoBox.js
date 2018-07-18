import React, { Component } from 'react';
import escapeRegExp from 'escape-string-regexp'
import sortBy from 'sort-by';

import dataLocations from './locations.json'

export default class InfoBox extends Component {
  state = {
    query: '',
    filteredLocations: dataLocations
  }

  updateQuery = (query) => {
    this.setState({ query })
    this.updateFilteredLocations(query)
  }

  updateFilteredLocations = (query) => {
    let showingLocation;

    if (query) {
      const match = new RegExp(escapeRegExp(query), 'i')
      showingLocation = this.props.locationsList.filter((location) => match.test(location.title))
      this.setState({ filteredLocations: showingLocation })
    } else {
      this.setState({ filteredLocations: this.props.locationsList })
    }
  }

  render() {
    const { query, filteredLocations } = this.state;
    filteredLocations.sort(sortBy('name'))

    return (
      <aside className="infoBox">
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
        <ul className="location-list">
        {
          filteredLocations.map(location => (
          <li
            className="location"
            key={location.key}
          >
            {location.title}
          </li>
          ))
        }
        </ul>
      </aside>
    )
  }
}
