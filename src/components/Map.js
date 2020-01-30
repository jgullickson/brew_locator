import React from 'react';
// import store from '../reducers/rootReducer';
// import tt from '@tomtom-international/web-sdk-services';
import tt from '@tomtom-international/web-sdk-maps';
import { connect } from 'react-redux';

class Map extends React.Component {
    constructor(props){
      super(props)
      this.populateResults = this.populateResults.bind(this)
      // this.createMarker = this.createMarker.bind(this)
      this.mapInit = this.mapInit.bind(this)
      this.map = null;
    }
    mapInit(){
       //initialize tomtom map
       tt.setProductInfo(this.props.name, this.props.version);
          this.map = tt.map({
          key: this.props.token,
          container: 'map',
          style: this.props.mode,
          center: [
            this.props.user_geo.lon,
            this.props.user_geo.lat
          ],
          zoom: this.props.user_geo.zoom
        }).addControl(new tt.GeolocateControl({
              positionOptions: {
                enableHighAccuracy: true
              },
              trackUserLocation: true
            }));
    }

    populateResults(){
      console.log(this.props.results)
      this.props.results.map(result =>{
        // console.log(result.name)
        this.createMarker(
          "https://img.icons8.com/metro/52/000000/beer.png",
         //"https://icons8.com/icon/3696/beer">Beer icon by Icons8
           [result.longitude, result.latitude], 
           'goldenrod', 
           result.name
          );
      })
    }
    createMarker(icon, position, color, popupText){
      //code from tomtom to create markers
      let markerElement = document.createElement('div');
      markerElement.className = 'marker';
  
      let markerContentElement = document.createElement('div');
      markerContentElement.className = 'marker-content';
      markerContentElement.style.backgroundColor = color;
      markerElement.appendChild(markerContentElement);
  
      let iconElement = document.createElement('div');
      iconElement.className = 'marker-icon';
      iconElement.style.backgroundImage ='url('+icon+')';
      markerContentElement.appendChild(iconElement);
  
      let popup = new tt.Popup({offset: 30}).setText(popupText);
      // add marker to map
      new tt.Marker({element: markerElement, anchor: 'bottom'})
        .setLngLat(position)
        .setPopup(popup)
        .addTo(this.map);      
    }

    componentDidMount(){
      this.mapInit();
      // this.populateResults()
    }
    componentDidUpdate(){
      this.mapInit()
      this.populateResults()
    }
    render(){
      return(
        <div id='map-container'>
          {this.props.isFetching ? <div id='fetchSpinner'/> : null}
          <div id='map'>
          </div>
        </div>
      )
    }
  }

  const mapState = (state) => {
    const { mode, user_geo, results, isFetching } = state
      //console.log(user_geo)
    return (
      { mode, user_geo, results, isFetching }
    )
  }
  
export default connect(mapState)(Map);