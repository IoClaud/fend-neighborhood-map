import React, { Component } from 'react'
import styles from './mapStyles.json'
import dataLocations from './locations.json'

class App extends Component {
  state = {
    locations: dataLocations
  }

  componentDidMount() {
    // Connect the initMap() function within this class to the global window context,
    // so Google Maps can invoke it
    window.initMap = this.initMap;
    // Asynchronously load the Google Maps script, passing in the callback reference
    loadJS('https://maps.googleapis.com/maps/api/js?libraries=places,geometry,drawing&key=AIzaSyAWKxlzrErKIVd3KfAdeVRj-uW1rRVsoH0&v=3&callback=initMap');
  }

  initMap = () => {
    const { locations } = this.state;

    let map = new window.google.maps.Map(document.getElementById('map'), {
      zoom: 14,
      center: { lat: 45.0765167, lng: 7.6708267 },
      styles: styles
    });

    for (let location of locations) {
      //console.log(location);
      let position = location.position;
      let title = location.title;
      let id = location.key;

      let marker = new window.google.maps.Marker({
        position: position,
        map: map,
        title: title,
        id: id
      });
    }

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
