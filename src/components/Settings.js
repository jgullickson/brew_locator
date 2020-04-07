import React from 'react';
import { connect } from 'react-redux';
import { selectState, fetchData } from '../actions';


class Settings extends React.Component {
    render(){
      return(
        <div id='settings' className='px-5 py-4'>
          <h3>Settings:</h3>
          <div id='button-container'>
          <select 
            defaultValue='Select State'
            onChange= {(e)=> {
              this.props.selectState(e.target.value);
              }}>
                  <option disabled>Select State</option>
                  {this.props.us_states.map((state, index) => <option key={index}>{state.state}</option>)}
          </select>
          <button 
            className = 'btn btn-warning mx-2'
            onClick = {this.props.fetchData}>
            Show Breweries!
          </button>
          </div>
        </div>
      )
    }
  };

  const mapState = (state) => {
    const { us_states } = state;
    return { us_states } 
  };

  const mapDispatch = (dispatch) => {
    return {
      selectState: (selectedState) => dispatch(selectState(selectedState)),
      fetchData: () => dispatch(fetchData())
    }
  }

  export default connect(mapState, mapDispatch)(Settings);