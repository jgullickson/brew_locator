import React from 'react';
import { connect } from 'react-redux';
import { toggleDarkMode, updateLocation, filterResults, selectState, fetchData } from '../actions';
// import { dispatch } from 'redux';


class Settings extends React.Component {
    // constructor(props){
    //   super(props)
    //   // this.handleChange = this.handleChange.bind(this)
    // }
    render(){
      return(
        <div id='settings'>
          <h3>Settings:</h3>
          <div id='button-container'>
          {/* <button className='btn btn-warning'
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
          </button> */}
          <select 
            defaultValue='Select State'
            onChange= {(e)=> {
              this.props.selectState(e.target.value);
              }}>
                  <option disabled>Select State</option>
                  {this.props.us_states.map((state, index) => <option key={index}>{state.state}</option>)}
          </select>
          <button onClick = {this.props.fetchData}>
            Find Breweries!
          </button>
          </div>
        </div>
      )
    }
  }

  const mapState = (state) => {
    const { us_states } = state;
    return { us_states } 
  }

  const mapDispatch = (dispatch) => {
    return {
      selectState: (selectedState) => dispatch(selectState(selectedState)),
      fetchData: () => dispatch(fetchData())
    }
  }

  export default connect(mapState, mapDispatch)(Settings);