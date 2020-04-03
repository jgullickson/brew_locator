import React from "react";
// import store from '../reducers/rootReducer';
// import tt from '@tomtom-international/web-sdk-services';
import tt from "@tomtom-international/web-sdk-maps";
import { connect } from "react-redux";

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.populateResults = this.populateResults.bind(this);
    this.createPopupHTML = this.createPopupHTML.bind(this);
    // this.createMarker = this.createMarker.bind(this)
    this.mapInit = this.mapInit.bind(this);
    this.map = null;
  }
  mapInit() {
    //initialize tomtom map
    tt.setProductInfo(this.props.name, this.props.version);
    this.map = tt
      .map({
        key: this.props.token,
        container: "map",
        style: this.props.mode,
        center: [this.props.geo.lon, this.props.geo.lat],
        zoom: this.props.geo.zoom
      })
      .addControl(
        new tt.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
          },
          trackUserLocation: true
        })
      );
  }
  createPopupHTML(brewery){
    /*
    id: 68
    name: "Haines Brewing Co"
    brewery_type: "micro"
    street: "327 Main St"
    city: "Haines"
    state: "Alaska"
    postal_code: "99827"
    country: "United States"
    longitude: "-135.4551927"
    latitude: "59.2357624"
    phone: "9077663823"
    website_url: "http://www.hainesbrewing.com"
    updated_at: "2018-08-23T23:20:50.755Z"
    */

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
    
    let popup = new tt.Popup({ offset: 30 }).setHTML(html);
    return popup
  }
  populateResults() {
    // console.log(this.props.results)
    this.props.results
      .filter(r => r.longitude !== null && r.latitude !== null)
      .map(r => {
        this.createMarker(
          "https://img.icons8.com/metro/52/000000/beer.png",
          [r.longitude, r.latitude],
          "goldenrod",
          this.createPopupHTML(r)
        );
        return undefined;
      });
  }
  createMarker(icon, position, color, popup) {
    //code from tomtom to create markers
    let markerElement = document.createElement("div");
    markerElement.className = "marker";

    let markerContentElement = document.createElement("div");
    markerContentElement.className = "marker-content";
    markerContentElement.style.backgroundColor = color;
    markerElement.appendChild(markerContentElement);

    let iconElement = document.createElement("div");
    iconElement.className = "marker-icon";
    iconElement.style.backgroundImage = "url(" + icon + ")";
    markerContentElement.appendChild(iconElement);

    // add marker to map
    new tt.Marker({ element: markerElement, anchor: "bottom" })
      .setLngLat(position)
      .setPopup(popup)
      .addTo(this.map);
  }

  componentDidMount() {
    this.mapInit();
    // store.dispatch(fetchData())
  }
  componentDidUpdate() {
    this.mapInit();
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
  const { mode, user_geo, geo, results, isFetching } = state;
  //console.log(user_geo)
  return { mode, user_geo, geo, results, isFetching };
};

export default connect(mapState)(Map);
