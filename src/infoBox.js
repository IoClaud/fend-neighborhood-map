import React, { Component } from 'react';

export default class InfoBox extends Component {
  state = {
    query: ''
  }

  render() {
    const { query } = this.state;

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
        />
        </form>
      </aside>
    )
  }
}
