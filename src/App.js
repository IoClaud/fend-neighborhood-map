import React, { Component } from 'react'
import fetchJsonp from 'fetch-jsonp';

import styles from './mapStyles.json'
import dataLocations from './locations.json'
import InfoBox from './infoBox'

class App extends Component {
  state = {
    locations: dataLocations,
    mapState: '',
    InfoWindow: {},
    markers: [],
    currentMarker: {},
    infoContent: ''
  }

  componentDidMount() {
    window.initMap = this.initMap;
    loadJS('https://maps.googleapis.com/maps/api/js?key=AIzaSyAWKxlzrErKIVd3KfAdeVRj-uW1rRVsoH0&v=3&callback=initMap');
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
      mapState: map,
      InfoWindow : infoWindow,
    });

    /* Create a marker for each location */
    for (let location of locations) {
      let position = location.position;
      let title = location.title;
      let id = location.key;
      let name = location.name;

      let marker = new window.google.maps.Marker({
        position: position,
        map: map,
        title: title,
        id: id,
        name: name,
        animation: window.google.maps.Animation.DROP
      });

      /* Get those markers into the state */
      markers.push(marker);

      /* Open infoWindow when click on the marker */
      marker.addListener('click', function () {
        self.getInfos(marker);

      });
    }
  }

  getInfos = (marker) => {
    let self = this
    /* Get the good URL */
    let place = marker.title;
    let srcUrl = 'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=' +
    place;
    srcUrl = srcUrl.replace(/ /g, '%20')

    fetchJsonp(srcUrl)
      .then(function(response) {
        return response.json()
      }).then(function (data) {
        //console.log(data.query.pages)
        let pages = data.query.pages
        let pageId = Object.keys(data.query.pages)[0]
        let pageContent = pages[pageId].extract

        self.populateInfoWindow(marker, pageContent)
        //console.log(self.state.infoContent);
      }).catch(function (error) {
        console.log('Parsing failed', error)
      })

  }

  populateInfoWindow(marker, infoContent) {
    const { mapState, InfoWindow } = this.state;
    
    /* Check if the open infoWindow is different from the clicked marker */
    if (InfoWindow.marker !== marker) {
      /* if it is, set infoWindow to the clicked marker */
      InfoWindow.marker = marker
      InfoWindow.setContent(`
        <div class="infoWindow-box">
        <header>
        <p class="infoWindow-attribution">Provided by Wikipedia</p>
        <h2 class="infoWindow-title">${marker.name}</h2>
        <hr/>
        </header>
        <article class="infoWindow-content">${infoContent}</article>
        </div>
        `)
      InfoWindow.open(mapState, marker)

      InfoWindow.addListener('closeclick', function () {
        InfoWindow.setMarker = null
      })
    } else {
      /* if click on the marker that has already open infoWindow, reopen it */
      InfoWindow.open(mapState, marker)
    }
  }

  render() {
    const { locations, markers } = this.state
    return (
      <div className="App">
        <InfoBox
          locationsList = {locations}
          markers={markers}
          getInfos = {this.getInfos}
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
