import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import {
  TOGGLE_DARK,
  CLEAR_RESULTS,
  SET_LOCATION,
  RECEIVE_DATA,
  REQUEST_DATA,
  REQUEST_FINISHED,
  REQUEST_LOCATION,
  RECEIVE_LOCATION,
  FILTER_RESULTS,
  SELECT_STATE,
  CLEAR_MARKERS_FROM_GLOBAL_STATE,
  PUSH_MARKERS_TO_GLOBAL_STATE,
  RESET_MAP_ZOOM,
  SET_MAP_REF,
  CHANGE_MODE
} from '../actions';

const initialState = {
  mode: 'by_state',
  isFetching: false,
  mapRef: null,
  stateList: [],
  us_states: [
    {
      state: "Alaska",
      latitude: 61.3850,
      longitude: -152.2683
    },
    {
      state: "Alabama",
      latitude: 32.7990,
      longitude: -86.8073
    },
    {
      state: "Arkansas",
      latitude: 34.9513,
      longitude: -92.3809
    },
    {
      state: "Arizona",
      latitude: 33.7712,
      longitude: -111.3877
    },
    {
      state: "California",
      latitude: 36.1700,
      longitude: -119.7462
    },
    {
      state: "Colorado",
      latitude: 39.0646,
      longitude: -105.3272
    },
    {
      state: "Connecticut",
      latitude: 41.5834,
      longitude: -72.7622
    },
    {
      state: "Delaware",
      latitude: 39.3498,
      longitude: -75.5148
    },
    {
      state: "Florida",
      latitude: 27.8333,
      longitude: -81.7170
    },
    {
      state: "Georgia",
      latitude: 32.9866,
      longitude: -83.6487
    },
    {
      state: "Hawaii",
      latitude: 21.1098,
      longitude: -157.5311
    },
    {
      state: "Iowa",
      latitude: 42.0046,
      longitude: -93.2140
    },
    {
      state: "Idaho",
      latitude: 44.2394,
      longitude: -114.5103
    },
    {
      state: "Illinois",
      latitude: 40.3363,
      longitude: -89.0022
    },
    {
      state: "Indiana",
      latitude: 39.8647,
      longitude: -86.2604
    },
    {
      state: "Kansas",
      latitude: 38.5111,
      longitude: -96.8005
    },
    {
      state: "Kentucky",
      latitude: 37.6690,
      longitude: -84.6514
    },
    {
      state: "Louisiana",
      latitude: 31.1801,
      longitude: -91.8749
    },
    {
      state: "Massachusetts",
      latitude: 42.2373,
      longitude: -71.5314
    },
    {
      state: "Maryland",
      latitude: 39.0724,
      longitude: -76.7902
    },
    {
      state: "Maine",
      latitude: 44.6074,
      longitude: -69.3977
    },
    {
      state: "Michigan",
      latitude: 43.3504,
      longitude: -84.5603
    },
    {
      state: "Minnesota",
      latitude: 45.7326,
      longitude: -93.9196
    },
    {
      state: "Missouri",
      latitude: 38.4623,
      longitude: -92.3020
    },
    {
      state: "Mississippi",
      latitude: 32.7673,
      longitude: -89.6812
    },
    {
      state: "Montana",
      latitude: 46.9048,
      longitude: -110.3261
    },
    {
      state: "North Carolina",
      latitude: 35.6411,
      longitude: -79.8431
    },
    {
      state: "North Dakota",
      latitude: 47.5362,
      longitude: -99.7930
    },
    {
      state: "Nebraska",
      latitude: 41.1289,
      longitude: -98.2883
    },
    {
      state: "New Hampshire",
      latitude: 43.4108,
      longitude: -71.5653
    },
    {
      state: "New Jersey",
      latitude: 40.3140,
      longitude: -74.5089
    },
    {
      state: "New Mexico",
      latitude: 34.8375,
      longitude: -106.2371
    },
    {
      state: "Nevada",
      latitude: 38.4199,
      longitude: -117.1219
    },
    {
      state: "New York",
      latitude: 42.1497,
      longitude: -74.9384
    },
    {
      state: "Ohio",
      latitude: 40.3736,
      longitude: -82.7755
    },
    {
      state: "Oklahoma",
      latitude: 35.5376,
      longitude: -96.9247
    },
    {
      state: "Oregon",
      latitude: 44.5672,
      longitude: -122.1269
    },
    {
      state: "Pennsylvania",
      latitude: 40.5773,
      longitude: -77.2640
    },
    {
      state: "Rhode Island",
      latitude: 41.6772,
      longitude: -71.5101
    },
    {
      state: "South Carolina",
      latitude: 33.8191,
      longitude: -80.9066
    },
    {
      state: "South Dakota",
      latitude: 44.2853,
      longitude: -99.4632
    },
    {
      state: "Tennessee",
      latitude: 35.7449,
      longitude: -86.7489
    },
    {
      state: "Texas",
      latitude: 31.1060,
      longitude: -97.6475
    },
    {
      state: "Utah",
      latitude: 40.1135,
      longitude: -111.8535
    },
    {
      state: "Virginia",
      latitude: 37.7680,
      longitude: -78.2057
    },
    {
      state: "Vermont",
      latitude: 44.0407,
      longitude: -72.7093
    },
    {
      state: "Washington",
      latitude: 47.3917,
      longitude: -121.5708
    },
    {
      state: "Wisconsin",
      latitude: 44.2563,
      longitude: -89.6385
    },
    {
      state: "West Virginia",
      latitude: 38.4680,
      longitude: -80.9696
    },
    {
      state: "Wyoming",
      latitude: 42.7475,
      longitude: -107.2085
    },
    {
      state: "District of Columbia",
      latitude: 38.8974,
      longitude: -77.0268
    },
    {
      state: "Puerto Rico",
      latitude: 18.2491,
      longitude: -66.628
    }
  ],
  selectedState: '',
  results: [],
  markers: [],
  filteredResults: [],
  user_geo: {
    lon: null,
    lat: null,
    zoom: 0
  },
  geo: {
    // approximate geographic center of united states
    lon: -95.7129,
    lat: 37.0902,
    zoom: 4
  }
};

const rootReducer = (state = initialState, action) => {

  switch (action.type) {

    case CHANGE_MODE:
      return Object.assign({}, state,
        {
          mode: action.mode
        });
    case SET_MAP_REF:
      return Object.assign({}, state,
        {
          mapRef: action.map
        })
    case TOGGLE_DARK:
      if (state.darkmode === false) {

        return Object.assign({}, state, { darkmode: true });

      } else if (state.darkmode === true) {

        return Object.assign({}, state, { darkmode: false });

      }
      break;

    case CLEAR_RESULTS:
      return Object.assign({}, state, { results: [] });

    case REQUEST_LOCATION:
      return (Object.assign({}, state,
        {
          isFetching: true
        }
      ));

    case SET_LOCATION:
      console.log('SET_LOCATION')
      console.log(action)
      return (
        Object.assign({}, state,
          {
            user_geo: {
              lon: action.location.lon,
              lat: action.location.lat,
              zoom: 15
            }
          }
        )
      );

    case RESET_MAP_ZOOM:
      return (
        Object.assign({}, state,
          {
            geo: {
              // approximate geographic center of united states
              lon: -95.7129,
              lat: 37.0902,
              zoom: 4
            }
          })
      )

    case RECEIVE_LOCATION:
      return (Object.assign({}, state,
        {
          isFetching: false
        }
      ));

    case REQUEST_DATA:
      return Object.assign({}, state, { isFetching: true });
    
    case REQUEST_FINISHED:
      return Object.assign({}, state, { isFetching: false });

    case RECEIVE_DATA:
      return Object.assign({}, state,
        {
          results: action.results,
          isFetching: false,
          stateList: action.results.map(res => res.state).filter((value, index, self) => self.indexOf(value) === index),
        });

    case SELECT_STATE:
      let state_geo_data = state.us_states.filter(s => s.state === action.selectedState)[0];

      state.mapRef.fire('selected-state', [state_geo_data.latitude, state_geo_data.longitude]);

      return (Object.assign({}, state,
        {
          selectedState: action.selectedState,
          geo: {
            lat: state_geo_data.latitude,
            lon: state_geo_data.longitude,
            zoom: 6
          }
        }));

    case FILTER_RESULTS:
      return (Object.assign({}, state,
        {
          filteredResults: state.results.filter(res => res.state === state.selectedState)
        }
      ));
    case CLEAR_MARKERS_FROM_GLOBAL_STATE:
      return (Object.assign({}, state,
        {
          markers: []
        }
      ));
    case PUSH_MARKERS_TO_GLOBAL_STATE:
      return (Object.assign({}, state,
        {
          markers: [...action.markers]
        }));
    default:
      return state;
  }
}

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;