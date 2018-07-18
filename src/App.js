import React, { Component } from 'react'
import styles from './mapStyles.json'
import locations from './locations.json'
import InfoBox from './infoBox'

class App extends Component {
  state = {
    locations: locations,
    map: '',
    infoWindow: ''
  }

  componentDidMount() {
    // Connect the initMap() function within this class to the global window context,
    // so Google Maps can invoke it
    window.initMap = this.initMap;
    // Asynchronously load the Google Maps script, passing in the callback reference
    loadJS('https://maps.googleapis.com/maps/api/js?libraries=places,geometry,drawing&key=AIzaSyAWKxlzrErKIVd3KfAdeVRj-uW1rRVsoH0&v=3&callback=initMap');
  }

  initMap = () => {
    let self = this;
    const { locations } = this.state;

    let infoWindow = new window.google.maps.InfoWindow();

    /* Define the map */
    let map = new window.google.maps.Map(document.getElementById('map'), {
      zoom: 14,
      center: { lat: 45.0765167, lng: 7.6708267 },
      styles: styles
    });

    /* Keep state in sync */
    this.setState({
      map,
      infoWindow
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

      /* Open infoWindow when click on the marker */
      marker.addListener('click', function () {
        self.populateInfoWindow(marker);
      });
    }
  }

  populateInfoWindow(marker) {
    const { map, infoWindow } = this.state;

    /* Check if the open infoWindow is different from the clicked marker */
    if (infoWindow.marker !== marker) {
      /* if it is, set infoWindow to the clicked marker */
      infoWindow.marker = marker
      infoWindow.setContent(`<div>${marker.title}</div>`)
      infoWindow.open(map, marker)

      infoWindow.addListener('closeclick', function () {
        infoWindow.setMarker = null
      });
    } else {
      /* if click on the marker that has already open infoWindow, reopen it */
      infoWindow.open(map, marker)
    }
  }

  render() {
    return (
      <div className="App">
        <InfoBox />
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
