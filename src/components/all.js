const { combineReducers, createStore, applyMiddleware} = Redux;
const { connect, Provider } = ReactRedux;
const thunk = ReduxThunk.default;

const DAY = 'tomtom://vector/1/basic-main';
const NIGHT = 'tomtom://vector/1/basic-night';

//https://developer.tomtom.com/maps-api/maps-api-documentation/map-styles

/*tomtom and react
execute map init code in componentDidMount(), then render/return the map container
https://developer.tomtom.com/maps-sdk-web/tutorials-basics/reactjs-map-init
*/

//temporary function
function populateResults(results){
    function createMarker(icon, position, color, popupText){
    //code from tomtom to create markers
    var markerElement = document.createElement('div');
    markerElement.className = 'marker';

    var markerContentElement = document.createElement('div');
    markerContentElement.className = 'marker-content';
    markerContentElement.style.backgroundColor = color;
    markerElement.appendChild(markerContentElement);

    var iconElement = document.createElement('div');
    iconElement.className = 'marker-icon';
    iconElement.style.backgroundImage ='url('+icon+')';
    markerContentElement.appendChild(iconElement);

    var popup = new tt.Popup({offset: 30}).setText(popupText);
    // add marker to map
    new tt.Marker({element: markerElement, anchor: 'bottom'})
      .setLngLat(position)
      .setPopup(popup)
      .addTo(document.getElementById('map'));
  }
    results.map(result=>{
      createMarker(
                  "https://img.icons8.com/metro/52/000000/beer.png",
                 //"https://icons8.com/icon/3696/beer">Beer icon by Icons8
                   [result.longitude, result.latitude], 
                   'goldenrod', 
                   result.name
                  );
    })
  }

//redux


// const populateResults = (dispatch) => {
//   //fetch data from openBreweryDB
//   fetch('https://api.openbrewerydb.org/breweries?by_state='+STATE)
//     .then((response) => {
//       return response.json();
//   })
//   // .then((data) => {
// //     data.forEach(brewery=>{
// //       createMarker("https://img.icons8.com/metro/52/000000/beer.png",
// //                    //"https://icons8.com/icon/3696/beer">Beer icon by Icons8
// //                    [brewery.longitude, brewery.latitude], 
// //                    'goldenrod', 
// //                    brewery.name);
// //     })
// //   });
//   dispatch({
//     type: POPULATE_RESULTS,
//     results: 
//   }
//  )
// }











