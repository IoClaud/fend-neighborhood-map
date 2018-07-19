import React, { Component } from 'react'

import styles from './mapStyles.json'
import dataLocations from './locations.json'
import InfoBox from './infoBox'

class App extends Component {
  state = {
    locations: dataLocations,
    map: '',
    InfoWindow: {},
    markers: [],
    infoWindowIsOpen: false,
    currentMarker: {}
  }

  componentDidMount() {
    window.initMap = this.initMap;
    loadJS('https://maps.googleapis.com/maps/api/js?libraries=places,geometry,drawing&key=AIzaSyAWKxlzrErKIVd3KfAdeVRj-uW1rRVsoH0&v=3&callback=initMap');
  }

  initMap = () => {
    let self = this;
    const { locations, markers } = this.state;

    let infoWindow = new window.google.maps.InfoWindow();

    /* Define the map */
    let map = new window.google.maps.Map(document.getElementById('map'), {
      zoom: 14,
      center: { lat: 45.0715073, lng: 7.6840879 },
      styles: styles
    });

    /* Keep state in sync */
    this.setState({
      map,
      InfoWindow : infoWindow
    });

    /* Create a marker for each location */
    for (let location of locations) {
      let position = location.position;
      let title = location.title;
      let id = location.key;

      let marker = new window.google.maps.Marker({
        position: position,
        map: map,
        title: title,
        id: id,
        animation: window.google.maps.Animation.DROP
      });

      /* Get those markers into the state */
      markers.push(marker);

      /* Open infoWindow when click on the marker */
      marker.addListener('click', function () {
        self.populateInfoWindow(marker);

      });
    }
  }

  populateInfoWindow(marker) {
    const { map, InfoWindow } = this.state;
    /* Check if the open infoWindow is different from the clicked marker */
    if (InfoWindow.marker !== marker) {
      /* if it is, set infoWindow to the clicked marker */
      InfoWindow.marker = marker
      InfoWindow.setContent(`<div>${marker.title}</div>`)
      InfoWindow.open(map, marker)

      InfoWindow.addListener('closeclick', function () {
        InfoWindow.setMarker = null
      })
    } else {
      /* if click on the marker that has already open infoWindow, reopen it */
      InfoWindow.open(map, marker)
    }
  }

  openInfoWindow = (marker) => {
    this.setState({
      infoWindowIsOpen: true,
      currentMarker: marker
    });
    this.populateInfoWindow(this.state.currentMarker)
  }

  render() {
    const { locations, markers } = this.state
    return (
      <div className="App">
        <InfoBox
          locationsList = {locations}
          markers={markers}
          openInfoWindow={this.openInfoWindow}
        />
        <div id="map" ref="map"></div>
      </div>
    );
  }
}

export default App;

function loadJS(src) {
  let ref = window.document.getElementsByTagName('script')[0];
  let script = window.document.createElement('script');
  script.src = src;
  script.async = true;
  ref.parentNode.insertBefore(script, ref);
  script.onerror = function () {
    document.write('Load error: Google Maps')
  };
}
