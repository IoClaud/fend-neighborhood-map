import React, { Component } from 'react'
import * as styles from './mapStyles.json'

class App extends Component {


  componentDidMount() {
    // Connect the initMap() function within this class to the global window context,
    // so Google Maps can invoke it
    window.initMap = this.initMap;
    // Asynchronously load the Google Maps script, passing in the callback reference
    loadJS('https://maps.googleapis.com/maps/api/js?libraries=places,geometry,drawing&key=AIzaSyAWKxlzrErKIVd3KfAdeVRj-uW1rRVsoH0&v=3&callback=initMap');
  }

  initMap() {
    let map = new window.google.maps.Map(document.getElementById('map'), {
      zoom: 13,
      center: { lat: 45.0765167, lng: 7.6708267 },
      styles: styles
    });

    let marker = new window.google.maps.Marker({
      position: { lat: 45.0765167, lng: 7.6708267 },
      map: map,
      title: 'First Marker'
    });

  }

  render() {
    return (
      <div className="App">
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
