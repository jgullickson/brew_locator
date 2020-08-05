import React from "react";
import { connect } from "react-redux";
import { pushMarkersToGlobalState, clearMarkersFromGlobalState, setMapRef } from '../../redux/actions';
import L from 'leaflet';
import markerIcon from '../../assets/images/geohop-marker.svg';
import markerShadow from '../../assets/images/leaflet/marker-shadow.png';
import styles from './Map.module.scss';

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.populateResults = this.populateResults.bind(this);
    this.createPopupHTML = this.createPopupHTML.bind(this);
    this.mapInit = this.mapInit.bind(this);
    this.mapUpdateView = this.mapUpdateView.bind(this);
    this.addMarkerToMap = this.addMarkerToMap.bind(this);
    this.createMarker = this.createMarker.bind(this);
    this.clearMarkersFromMap = this.clearMarkersFromMap.bind(this);
    this.map = null;
    this.markers = [];
  }

  mapInit() {

    const mapOptions = {
      worldCopyJump: true,
      // zoomSnap: 0.5,
      // zoomDelta: 0.5
      // zoomAnimationThreshold: 1000
    };

    this.map = L.map('map', mapOptions).setView([this.props.geo.lat, this.props.geo.lon], this.props.geo.zoom);

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      // id: 'mapbox/streets-v11',
      // id: 'mapbox/light-v10',
      id: 'mapbox/dark-v10',
      // id: 'mapbox/outdoors-v11',
      // id: 'mapbox/satellite-v9',
      // id: 'mapbox/satellite-streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: this.props.accessToken,
    }).addTo(this.map);

    this.map.addEventListener('popupopen-from-list', (eventData) => {
      const lat = eventData[0];
      const lng = eventData[1]; 
      this.map.flyTo([lat, lng], 10);
    })

    this.map.addEventListener('locationfound', (l) => {
      console.log('it worked! location found')
      console.log(l)
    })

    this.map.addEventListener('geolocate', (user_geo_data) => {
      console.log('geolocated')

      const geoIcon = L.divIcon({ className: styles['geo-icon'], html: `<div class=${styles.pulser}></div>` })
      
      const addGeoMarker = () => {
        const geoMarker = L.marker([user_geo_data.lat, user_geo_data.lon], {icon: geoIcon});
        geoMarker.addTo(this.map)
      }

      addGeoMarker()
      this.map.flyTo([user_geo_data.lat, user_geo_data.lon], user_geo_data.zoom);
    })

    // const popupListener = this.map.addEventListener('popupopen', (popup_event) => {
    //   this.map.panTo(popup_event.popup._latlng);
    //   // this.map.flyTo(popup_event.popup._latlng, 10);
    // })

    this.props.setMapRef(this.map)
    
  }
  mapUpdateView(){
    this.map.setView([this.props.geo.lat, this.props.geo.lon], this.props.geo.zoom);
  }
  createPopupHTML(brewery){
    let html = `<div class=${styles['popup-container']}>`;
        
        html+=`<span class=${styles['popup-title']}>${brewery.name}</span>`;

        html += `<div class=${styles['popup-address']}>`;
                  if (brewery.street) html += `<span'>${brewery.street}</span><br>`
                  if (brewery.state) html +=`<span>${brewery.city}, ${brewery.state}</span>`
        html +=  `</div>`;
        
        if(brewery.phone) html +=`<a class=${styles['popup-link']} href=tel:${brewery.phone}><i class='material-icons'>phone</i>${brewery.phone}</a>`;
        
        if (brewery.website_url) html+=`<a class=${styles['popup-link']} href=${brewery.website_url}><i class='material-icons'>computer</i>Website</a>`;

        let search_url = encodeURI(`http://www.google.com/search?q=${brewery.name} ${brewery.state}`);
        html += `<a class=${styles['popup-link']} href=${search_url}><i class='material-icons'>search</i>More info</a>`

    html+=`</div>`;
    
    return html;
  }
  populateResults() {

    this.clearMarkersFromMap();

    this.props.results
      .filter(r => r.longitude !== null && r.latitude !== null)
      .map(r => {
        this.createMarker(
          [r.latitude, r.longitude],
          this.createPopupHTML(r),
          r.id
        );
        return undefined;
      });
    
    this.props.pushMarkersToGlobalState(this.markers);
    
    this.markers.forEach(marker => {
      this.addMarkerToMap(marker);
    })
  }
  createMarker(latlon, popup, markerId) {

    var myIcon = L.icon({
      iconUrl: markerIcon,
      iconSize: [38, 95],
      iconAnchor: [22, 94],
      popupAnchor: [-3, -76],
      shadowUrl: markerShadow,
      shadowSize: [68, 95],
      shadowAnchor: [22, 94]
  });
  
    let marker = L.marker(latlon, { icon: myIcon });
    
    marker.bindPopup(popup);

    marker.id = markerId;

    this.markers.push(marker);

  }

  addMarkerToMap(marker) {
    marker.addTo(this.map);
  }

  clearMarkersFromMap() {
    if (this.markers.length > 0) {
      this.markers.forEach(marker => {
        this.map.removeLayer(marker)
      }) 
    }
    this.props.clearMarkersFromGlobalState();
    this.markers = [];
  }

  componentDidMount() {
    this.mapInit();
  }
  componentDidUpdate() {
    // this.mapUpdateView();
    this.populateResults();
  }
  componentWillUnmount() {
    this.map.removeEventListener('popupopen-from-list', (eventData) => {
      const lat = eventData[0];
      const lng = eventData[1];
      this.map.flyTo([lat, lng], 10);
    })

    this.map.removeEventListener('locationfound', () => console.log('it worked! location found'))
  }
  render() {
    return (
      <div className={styles['map-container']}>
        {this.props.isFetching ? <div className={styles.fetchSpinner} /> : null}
        <div id="map" className={styles.map}></div>
      </div>
    );
  }
}

const mapState = state => {
  const { modes, darkmode, user_geo, geo, results, isFetching } = state;
  return { modes, darkmode, user_geo, geo, results, isFetching };
};

const mapDispatch = dispatch => {
  return {
    pushMarkersToGlobalState: (markers) => dispatch(pushMarkersToGlobalState(markers)),
    clearMarkersFromGlobalState: () => dispatch(clearMarkersFromGlobalState()),
    setMapRef: (map) => dispatch(setMapRef(map))
  }
}

export default connect(mapState, mapDispatch)(Map);
