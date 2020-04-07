import React from "react";
import { connect } from "react-redux";
import L from 'leaflet';
import markerIcon from '../assets/images/geohop-marker.svg';
import markerShadow from '../assets/images/leaflet/marker-shadow.png';

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.populateResults = this.populateResults.bind(this);
    this.createPopupHTML = this.createPopupHTML.bind(this);
    this.mapInit = this.mapInit.bind(this);
    this.mapUpdateView = this.mapUpdateView.bind(this);
    this.map = null;
  }
  mapInit() {
    this.map = L.map('map').setView([this.props.geo.lat, this.props.geo.lon], this.props.geo.zoom);
    // let map = L.map('map').setView([this.props.geo.lat, this.props.geo.lon], 4);
      L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/dark-v10',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoianRndWxsaWNrc29uIiwiYSI6ImNrOHBkc3BkZDA3bGgzZXBkYzg3OG55dnUifQ._aiBtIEwpmpTDFs9Vpb91Q'
      }).addTo(this.map);
  }
  mapUpdateView(){
    this.map.setView([this.props.geo.lat, this.props.geo.lon], this.props.geo.zoom);
  }
  createPopupHTML(brewery){
    let html = `<div class='popup-container'>`;
        
        html+=`<span class='popup-title'>${brewery.name}</span>`;

        html += `<div class='popup-address'>`;
                  if (brewery.street) html += `<span'>${brewery.street}</span><br>`
                  if (brewery.state) html +=`<span>${brewery.city}, ${brewery.state}</span>`
        html +=  `</div>`;
        
        if(brewery.phone) html +=`<a class='popup-link' href=tel:${brewery.phone}><i class='material-icons'>phone</i>${brewery.phone}</a>`;
        
        if (brewery.website_url) html+=`<a class='popup-link' href=${brewery.website_url}><i class='material-icons'>computer</i>Website</a>`;

        let search_url = encodeURI(`http://www.google.com/search?q=${brewery.name} ${brewery.state}`);
        html += `<a class='popup-link' href=${search_url}><i class='material-icons'>search</i>More info</a>`

    html+=`</div>`;
    
    return html;
  }
  populateResults() {
    //  "https://img.icons8.com/metro/52/000000/beer.png"
    this.props.results
      .filter(r => r.longitude !== null && r.latitude !== null)
      .map(r => {
        this.createMarker(
          [r.latitude, r.longitude],
          this.createPopupHTML(r)
        );
        return undefined;
      });
  }
  createMarker(latlon, popup) {

    var myIcon = L.icon({
      iconUrl: markerIcon,
      iconSize: [38, 95],
      iconAnchor: [22, 94],
      popupAnchor: [-3, -76],
      shadowUrl: markerShadow,
      shadowSize: [68, 95],
      shadowAnchor: [22, 94]
  });

    let marker = L.marker(latlon, {icon: myIcon}).addTo(this.map);
    
    marker.bindPopup(popup)

  }

  componentDidMount() {
    this.mapInit();
  }
  componentDidUpdate() {
    this.mapUpdateView();
    this.populateResults();
  }
  render() {
    return (
      <div id="map-container">
        {this.props.isFetching ? <div id="fetchSpinner" /> : null}
        <div id="map"></div>
      </div>
    );
  }
}

const mapState = state => {
  const { modes, darkmode, user_geo, geo, results, isFetching } = state;
  return { modes, darkmode, user_geo, geo, results, isFetching };
};

export default connect(mapState)(Map);
