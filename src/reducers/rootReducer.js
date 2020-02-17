import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { TOGGLE_DARK, CLEAR_RESULTS, SET_LOCATION, RECEIVE_DATA, REQUEST_DATA, REQUEST_LOCATION, RECEIVE_LOCATION, FILTER_RESULTS, SELECT_STATE } from '../actions';

const DAY = 'tomtom://vector/1/basic-main';
const NIGHT = 'tomtom://vector/1/basic-night';

//initial state
const initialState = {
    isFetching: false,
    mode: DAY,
    stateList: [],
    selectedState: '',
    results: [],
    filteredResults: [],
    user_geo: {
      lon: null,
      lat: null,
      zoom: 0
    }
  }

const rootReducer = (state = initialState, action) => {
    switch (action.type){
      case TOGGLE_DARK:
        if (state.mode === DAY){
          return Object.assign({}, state, {mode: NIGHT});
        } else if (state.mode === NIGHT){
          return Object.assign({}, state, {mode: DAY});
        }
        break;
      case CLEAR_RESULTS:
        return Object.assign({}, state, {results: []})
        //break;
      case REQUEST_LOCATION: 
        return (Object.assign({}, state,
            {
              isFetching: true
            }
          ))
      case SET_LOCATION:
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
        case RECEIVE_LOCATION: 
        return (Object.assign({}, state,
            {
              isFetching: false
            }
          ))
        //break;
      case REQUEST_DATA:
         // console.log('reducer says: data requested')
         return Object.assign({}, state, {isFetching: true})
        //break;
      case RECEIVE_DATA:
        return Object.assign({}, state, 
          {
            results: action.results, 
            isFetching: false,
            stateList: action.results.map(res => res.state).filter((value, index, self)=>self.indexOf(value) === index ),
          });
        //break;
      case SELECT_STATE:
        console.log(action.selectedState)
        return (Object.assign({}, state, {selectedState: action.selectedState}))
      case FILTER_RESULTS: 
          console.log('filtering!!')
          console.log(state.selectedState)
          return (Object.assign({}, state,
            {
              filteredResults: state.results.filter(res => res.state === state.selectedState)
            }
            ))
      default:
        return state;
    }
  }

  const store = createStore(rootReducer, applyMiddleware(thunk));
  
  export default store;