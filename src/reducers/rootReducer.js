import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { TOGGLE_DARK, CLEAR_RESULTS, SET_LOCATION, RECEIVE_DATA, REQUEST_DATA } from '../actions';

const DAY = 'tomtom://vector/1/basic-main';
const NIGHT = 'tomtom://vector/1/basic-night';

//initial state
const initialState = {
    isFetching: false,
    mode: DAY,
    stateList: [],
    //location: 'Minnesota',
    results: [],
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
        //break;
      case REQUEST_DATA:
         // console.log('reducer says: data requested')
         return Object.assign({}, state, {isFetching: true})
        //break;
      case RECEIVE_DATA:
        return Object.assign({}, state, {results: action.results, isFetching: false});
        //break;
      default:
        return state;
    }
  }

  const store = createStore(rootReducer, applyMiddleware(thunk));
  
  export default store;