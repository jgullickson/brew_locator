//ACTIONS
export const SET_LOCATION = 'SET_LOCATION';
export const TOGGLE_DARK = 'TOGGLE_DARK';
export const CLEAR_RESULTS = 'CLEAR_RESULTS';
export const POPULATE_RESULTS = 'POPULATE_RESULTS'

//ACTION CREATORS
export const setLocation = (loc) => {
  return {
    type: SET_LOCATION, 
    location: {
      lon: loc.coords.longitude,
      lat: loc.coords.latitude
    }
  }
}

export const toggleDarkMode = () => {
  return {
     type: TOGGLE_DARK,
  }
}

export const clearResults = () => {
  return {
    type: CLEAR_RESULTS
  }
}

//request, fetch, recieve

export const REQUEST_DATA = 'REQUEST_DATA';
export const FETCH_DATA = 'FETCH_DATA';
export const RECEIVE_DATA = 'RECEIVE_DATA';

export const requestData = ()=>{
  return {
    type: REQUEST_DATA
  }
}

export const receiveData = (data)=>{
  return {
    type: RECEIVE_DATA,
    results: data
  }
}

/*
Fetches all breweries; 
Takes a few seconds. 
For future optimization, consider modifying to only fetch breweries by a specific location, or within a radius of current location (though I'm not sure that the api allows one to specify that);
*/
export const fetchData = () => {
  
  return function(dispatch) {
    
    dispatch(requestData());

    let allData = [];

    async function fetchLoop() {

      let pages_remain = true;
      let currentPage = 0;

      while (pages_remain == true){
          let response = await fetch(`https://api.openbrewerydb.org/breweries?page=${currentPage}`);
          let data = await response.json()
          if (data.length > 0){
            data.map(d => allData.push(d))
          } else {
            pages_remain = false;
          }
          currentPage++
        }
        dispatch(receiveData(allData))
        console.log(`fetched data for ${allData.length} breweries`)
      }
      fetchLoop().catch(error => {
        console.error(error);
        console.log('Oops! There`s an issue with the fetch request defined in actions.js');
      })
    }
}