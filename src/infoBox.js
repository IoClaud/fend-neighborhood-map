import React, { Component } from 'react';

export default class InfoBox extends Component {
  state = {
    query: ''
  }

  updateQuery = (query) => {
    this.setState({ query })
  }

  render() {
    const { query } = this.state;

    return (
      <aside className="infoBox">
        <form
          className="info-form"
          onSubmit={(event) => event.preventDefault()}
        >
        <button className="info-btn">
          List
        </button>
        <input
          className="info-input"
          type="text"
          placeholder="Search location..."
          value={query}
          onChange = {(event) => this.updateQuery(event.target.value)}
        />
        </form>
      </aside>
    )
  }
}
