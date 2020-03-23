//ACTIONS
export const SET_LOCATION = "SET_LOCATION";
export const TOGGLE_DARK = "TOGGLE_DARK";
export const CLEAR_RESULTS = "CLEAR_RESULTS";
export const POPULATE_RESULTS = "POPULATE_RESULTS";
export const REQUEST_LOCATION = "REQUEST_LOCATION";
export const RECEIVE_LOCATION = "RECEIVE_LOCATION";
export const FILTER_RESULTS = "FILTER_RESULTS";
export const SELECT_STATE = "SELECT_STATE";
export const REQUEST_DATA = "REQUEST_DATA";
export const FETCH_DATA = "FETCH_DATA";
export const RECEIVE_DATA = "RECEIVE_DATA";

//ACTION CREATORS
export const setLocation = loc => {
  return {
    type: SET_LOCATION,
    location: {
      lon: loc.coords.longitude,
      lat: loc.coords.latitude
    }
  };
};

//updateLocation

export const updateLocation = loc => {
  return function(dispatch) {
    dispatch(requestLocation());

    dispatch(setLocation(loc));

    dispatch(receiveLocation());
  };
};

export const requestLocation = () => {
  return {
    type: REQUEST_LOCATION
  };
};

export const receiveLocation = () => {
  return {
    type: RECEIVE_LOCATION
  };
};

export const toggleDarkMode = () => {
  return {
    type: TOGGLE_DARK
  };
};

export const clearResults = () => {
  return {
    type: CLEAR_RESULTS
  };
};

//request, fetch, recieve

export const requestData = () => {
  return {
    type: REQUEST_DATA
  };
};

export const receiveData = data => {
  return {
    type: RECEIVE_DATA,
    results: data
  };
};

/*
Fetches all breweries; 
Takes a few seconds. 
For future optimization, consider modifying to only fetch breweries by a specific location, or within a radius of current location (though I'm not sure that the api allows one to specify that);
*/
// export const fetchData = () => {

//   return function(dispatch) {

//     dispatch(requestData());

//     let allData = [];

//     async function fetchLoop() {

//       let pages_remain = true;
//       let currentPage = 0;

//       while (pages_remain === true){
//           let response = await fetch(`https://api.openbrewerydb.org/breweries?page=${currentPage}`);
//           let data = await response.json()
//           if (data.length > 0){
//             data.map(d => allData.push(d))
//           } else {
//             pages_remain = false;
//           }
//           currentPage++
//         }
//         dispatch(receiveData(allData))
//         console.log(`fetched data for ${allData.length} breweries`)
//       }
//       fetchLoop().catch(error => {
//         console.error(error);
//         console.log('Oops! There`s an issue with the fetch request defined in actions.js');
//       })
//     }
// }

export const fetchData = () => {
  return function(dispatch, getState) {
    dispatch(requestData());

    let allData = [];
    const { selectedState } = getState();

    async function fetchLoop() {
      let pages_remain = true;
      //pages 0 and 1 in api are identical
      let currentPage = 1;
      while (pages_remain === true) {
        let url = `https://api.openbrewerydb.org/breweries?by_state=${selectedState}&per_page=50&page=${currentPage}`;
        console.log(url)
        let response = await fetch(encodeURI(url));
        console.log(response)
        let data = await response.json();
        console.log(data)
        if (data.length > 0) {
          data
            .map(d => allData.push(d));
        } else {
          pages_remain = false;
        }
        currentPage++;
      }
      dispatch(receiveData(allData));
      console.log(`fetched data for ${allData.length} breweries`);
    }
    fetchLoop().catch(error => {
      console.error(error);
      console.log(
        "Oops! There`s an issue with the fetch request defined in actions.js"
      );
    });
  };
};

export const filterResults = selectedState => {
  return {
    type: FILTER_RESULTS,
    selectedState: selectedState
  };
};

export const selectState = selectedState => {
  return {
    type: SELECT_STATE,
    selectedState: selectedState
  };
};
