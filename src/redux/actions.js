import Swal from "sweetalert2";
import colors from "../styles/colors.scss";
import * as g from "../helpers/geolocation";

export const SET_LOCATION = "SET_LOCATION";
export const TOGGLE_DARK = "TOGGLE_DARK";
export const CLEAR_RESULTS = "CLEAR_RESULTS";
export const POPULATE_RESULTS = "POPULATE_RESULTS";
export const REQUEST_LOCATION = "REQUEST_LOCATION";
export const RECEIVE_LOCATION = "RECEIVE_LOCATION";
export const FILTER_RESULTS = "FILTER_RESULTS";
export const SELECT_STATE = "SELECT_STATE";
export const REQUEST_DATA = "REQUEST_DATA";
export const REQUEST_FINISHED = "REQUEST_FINISHED";
export const FETCH_DATA = "FETCH_DATA";
export const RECEIVE_DATA = "RECEIVE_DATA";
export const PUSH_MARKERS_TO_GLOBAL_STATE = "PUSH_MARKERS_TO_GLOBAL_STATE";
export const CLEAR_MARKERS_FROM_GLOBAL_STATE = "CLEAR_MARKERS_FROM_GLOBAL_STATE";
export const RESET_MAP_ZOOM = "RESET_MAP_ZOOM";
export const SET_MAP_REF = "SET_MAP_REF";
export const CHANGE_MODE = "CHANGE_MODE";

export const setLocation = loc => {
  return {
    type: SET_LOCATION,
    location: {
      lon: loc.longitude,
      lat: loc.latitude
    }
  };
};

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

export const requestData = () => {
  return {
    type: REQUEST_DATA
  };
};

export const requestFinished = () => {
  return {
    type: REQUEST_FINISHED
  }
}

export const receiveData = data => {
  return {
    type: RECEIVE_DATA,
    results: data
  };
};

export const getBreweries = async (options) => {

  let allData = [];

  async function fetchLoop() {

    let pages_remain = true;

    //pages 0 and 1 in api are identical
    let currentPage = 1;

    while (pages_remain === true) {

      let url;

      switch (options.mode) {
        case 'by_state':
          url = `https://api.openbrewerydb.org/breweries?by_state=${options.query}&per_page=50&page=${currentPage}`;
          console.log(url);
          break;
        case 'by_name':
          url = `https://api.openbrewerydb.org/breweries?by_name=${options.query}&per_page=50&page=${currentPage}`;
          console.log(url);
          break;
        case 'by_postal':
          url = `https://api.openbrewerydb.org/breweries?by_postal=${options.query}&per_page=50&page=${currentPage}`;
          console.log(url);
          break;
        default:
          url = `https://api.openbrewerydb.org/breweries?per_page=50&page=${currentPage}`;
          console.log(url);
      }

      let response = await fetch(encodeURI(url));

      let data = await response.json();

      if (data.length > 0) {
        for (const d of data) {
          allData.push(d);
        }
      } else {
        pages_remain = false;
      }

      currentPage++;
    }

    if (allData.length === 0) {
      Swal.fire({
        title: 'Sorry, no results were found',
        text: 'Please try searching for something else',
        icon: 'error',
        confirmButtonColor: colors['theme-green'],
        confirmButtonText: 'CLOSE',
        background: colors.light
      })
    }

    console.log(`fetched data for ${allData.length} breweries`);
  }

  await fetchLoop().catch(error => {
    console.error(error);
    console.error("Oops! There's an issue with the fetch request defined in actions.js");
  });

  return allData;

};


export const fetchData = (options) => {
  return async function (dispatch) {

    dispatch(requestData());

    let data = [];

    if (options.mode === 'by_geo') {
      /**
       * Geo mode fetches data for user's state and surrounding states, and then filters results.
       * This is a workaround as openbrewerydb does not have a geolocation endpoint.
       * Data is fetched from adjacent states, as the specified search radius could cross state lines.
       * Still results in fetching more data than needed, but ultimately requires significantly fewer API calls than fetching ALL data and then filtering.
       */
      for (const state of options.state_cluster) {
        const results = await getBreweries({ mode: 'by_state', query: state });
        data = [...data, ...results];
      }

      const geoFilteredData = data.filter(brewery => options.geoFilter(brewery));

      dispatch(receiveData(geoFilteredData));

    } else {
      const results = await getBreweries({ mode: options.mode, query: options.query })
      console.log(results)
      data = [...results];

      dispatch(receiveData(data));
    }
  }
}

export const handleGeoError = (error) => {
  // not perfect; revisit this function / error handling for this feature
  Swal.fire({
    title: 'Error',
    html: `<h3>${ error.error_description }</h3><br><p>There was an error when getting your geolocation. Please make sure geolocation is enabled in your browser, then refresh the page and try again.</p>`,
    icon: 'error',
    confirmButtonColor: colors['theme-green'],
    confirmButtonText: 'REFRESH',
    background: colors.light
  }).then(()=>{
    window.location.reload()
  })
}

export const fetchDataByGeo = (searchRadius) => {

  return async function (dispatch, getState) {
    
    dispatch(requestData());

    try {
      const { user_geo } = await getState();
      const buffer = g.create_buffer(user_geo, searchRadius);
      const boundingBox = g.bbox_from_buffer(buffer);
      const latlonBounds = g.latlng_bounds_from_bbox(boundingBox);

      const geoFilter = (brewery) => {
        console.log(brewery)
        if (!brewery.longitude || !brewery.latitude) {
          return false;
        } else {
          return latlonBounds.contains([parseFloat(brewery.latitude), parseFloat(brewery.longitude)]);
        }
      }

      console.log('getting us state:')
      const state_cluster = await g.get_state_cluster(user_geo);

      dispatch(fetchData({ mode: 'by_geo', state_cluster, geoFilter }));

    } catch (error) {
      console.error(error);
      handleGeoError(error);
    } finally {
      dispatch(requestFinished())
    }

  }
}

export const getUserLocation = () => {

  return async (dispatch, getState) => {

    dispatch(requestData());

    try {
      let user_location = await g.geo_get();

      dispatch(setLocation({
        latitude: user_location.lat,
        longitude: user_location.lng
      }))

    } catch (e) {
      console.error(e)
    } finally {
      dispatch(requestFinished())
    }
  }
}

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

export const pushMarkersToGlobalState = markers => {
  return {
    type: PUSH_MARKERS_TO_GLOBAL_STATE,
    markers
  }
}

export const clearMarkersFromGlobalState = () => {
  console.log('clear markers')
  return {
    type: CLEAR_MARKERS_FROM_GLOBAL_STATE
  }
}

export const resetMapZoom = () => {
  return {
    type: RESET_MAP_ZOOM
  }
}

export const setMapRef = (map) => {
  return {
    type: SET_MAP_REF,
    map
  }
}

export const changeMode = (mode) => {
  return {
    type: CHANGE_MODE,
    mode
  }
}