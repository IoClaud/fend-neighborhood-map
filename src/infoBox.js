import React, { Component } from 'react';
import escapeRegExp from 'escape-string-regexp'

export default class InfoBox extends Component {
  state = {
    query: ''
  }

  updateQuery = (query) => {
    this.setState({ query })
  }

  render() {
    const { query } = this.state;
    const { locationsList } = this.props;

    let showingLocation;

    if (query) {
      const match = new RegExp(escapeRegExp(query), 'i')
      showingLocation = locationsList.filter((location) => match.test(location.title))
    } else {
      showingLocation = locationsList
    }

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
          showingLocation.map(location => (
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
