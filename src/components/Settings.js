import React from 'react';
import store from '../reducers/rootReducer';
import { connect } from 'react-redux';
import { toggleDarkMode, updateLocation, filterResults, selectState } from '../actions';
// import { dispatch } from 'redux';


class Settings extends React.Component {
    constructor(props){
      super(props)
      // this.handleChange = this.handleChange.bind(this)
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
                          store.dispatch(updateLocation(position))
                        })
                      } else {
                        window.alert('Please allow the app to access your location')
                      }
                    }
                  }>
            Jump to My Location
          </button>
          <button className='btn btn-danger'
                  onClick={ async ()=>{
                    // console.log(store.getState())
                    await store.dispatch(filterResults())
                    console.log(store.getState())
                    }
                  }>
            Find Breweries Near Me!
          </button>
          <button className='btn btn-success'
                  onClick={ ()=>{
                    console.log(store.getState())
                    // await store.dispatch(filterResults())
                    // console.log(store.getState())
                    }
                  }>
           Log store state
          </button>
          <select defaultValue='Select State' onChange= {(e)=> this.props.selectState(e.target.value)}>
                  <option disabled>Select State</option>
                  {this.props.stateList.map((state, index) => <option key={index}>{state}</option>)}
          </select>
          </div>
        </div>
      )
    }
  }

  const mapState = (state) => {
    const { stateList } = state;
    return { stateList } 
  }

  const mapDispatch = (dispatch) => {
    return {
      selectState: (selectedState) => dispatch(selectState(selectedState))
    }
  }

  export default connect(mapState, mapDispatch)(Settings);