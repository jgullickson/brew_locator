import React from 'react';
import store from '../reducers/rootReducer';
import { toggleDarkMode, setLocation, fetchData } from '../actions';
// import { dispatch } from 'redux';


class Settings extends React.Component {
    constructor(props){
      super(props)
    }
    render(){
      return(
        <div id='settings'>
          <h3>Settings:</h3>
          <div id='button-container'>
          <button className='btn btn-info' 
                  onClick={()=>{
                    store.dispatch(toggleDarkMode())
                    /*bug with having to click button twice
                https://www.eventbrite.com/engineering/a-story-of-a-react-re-rendering-bug/
              */
                  }}>
            Dark Mode
          </button>
          <button className='btn btn-warning'
                  onClick={()=>{
                      if(navigator.geolocation){
                        navigator.geolocation.getCurrentPosition((position)=>{
                          store.dispatch(setLocation(position))
                        })
                      } else {
                        window.alert('Please allow the app to access your location')
                      }
                    }
                  }>
            Jump to My Location
          </button>
          <button className='btn btn-danger'
                  onClick={ ()=>{
                      store.dispatch(fetchData())
                    }
                  }>
            Find Breweries!
          </button>
          </div>
        </div>
      )
    }
  }

  export default Settings;