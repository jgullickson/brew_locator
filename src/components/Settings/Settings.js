import React from 'react';
import { connect } from 'react-redux';
import { geo_get, geo_rev } from '../../helpers/geolocation';
import { selectState, fetchData, resetMapZoom, changeMode, fetchDataByGeo, getUserLocation } from '../../redux/actions';
import styles from './Settings.module.scss';
import Swal from 'sweetalert2';
import colors from '../../styles/colors.scss';


class Settings extends React.Component {
  constructor(props) {
    super(props);

    this.selectTab = this.selectTab.bind(this);
    this.handleSearchBox = this.handleSearchBox.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSearchRadius = this.handleSearchRadius.bind(this);

    this.state = {
      selectedTab: 0,
      tabs: [
        {
          title: 'By State',
          mode: 'by_state'
        },
        {
          title: 'Near Me',
          mode: 'by_geo'
        },
        // {
        //   title: 'By Name',
        //   mode: 'by_name'
        // }
      ],
      searchBox: "",
      searchRadius: 5
    }

  }
  selectTab(tabIndex, mode) {
    this.setState({ selectedTab: tabIndex })
    this.props.changeMode(mode)
  }
  handleSearchBox(e) {
    this.setState({searchBox: e.target.value})
  }
  handleSearchRadius(e) {
    this.setState({searchRadius: e.target.value})
  }
  handleSearch(options) {
    const validSearch = () => {
      switch (options.mode) {
        case 'by_state':
          return this.props.selectedState ? true : false;
        case 'by_name':
          return this.state.searchBox.length > 0 ? true : false;
        default:
          return false;
      }
    }
    if (validSearch()) {
      this.props.fetchData({ ...options, query: this.props.selectedState })
    } else {
      Swal.fire({
        title: 'No search term selected',
        confirmButtonColor: colors['theme-green'],
        confirmButtonText: 'CLOSE',
        background: colors.light
      })
    }
  }
  render() {
    return (
      <div id='settings' className={`${styles.settings}`}>
        <h3>Find Breweries</h3>

        <div className={styles['tabs-container']}>

          {/* TAB MENU */}
          <ul className={styles['tabs-list']}>
            {this.state.tabs.map((tab, index) => {

              return (
                <li id={`tab-${index}-${tab.title}`} className={`${styles['tab']} ${this.state.selectedTab === index && styles['selected-tab']}`} key={tab.title}>
                  <button className='btn' onClick={() => this.selectTab(index, tab.mode)}>{tab.title}</button>
                </li>
              )
            })}
          </ul>

          {/* TAB 0 */}
          {
            this.state.selectedTab === 0 && (
              <div className={styles['button-container']}>
                <div className="form-group">
                  <label htmlFor="stateSelect">Search by state:</label>
                  <select
                    id="stateSelect"
                    className="form-control"
                    aria-describedby="selectHelp"
                    defaultValue='Select State'
                    onChange={(e) => {

                      this.props.selectState(e.target.value)
                      

                    }}>
                    <option disabled>Select State</option>
                    {this.props.us_states.map((state, index) => <option key={index}>{state.state}</option>)}
                  </select>
                  <small id="selectHelp" className="form-text text-muted">Show all breweries in a given state.</small>
                </div>

                <button
                  className='btn btn-warning'
                  onClick={() => this.handleSearch({mode: 'by_state'})}>Search</button>
              </div>
            )
          }

          {/* TAB 1 */}
          {
            this.state.selectedTab === 1 && (
              <>
                <div className="form-group">
                  <label htmlFor="searchRadius">Search Radius</label>
                  <input className="form-control" id="searchRadius" type="number" min="1" max="50" onChange={this.handleSearchRadius} value={this.state.searchRadius}></input>
                </div>
              <button
                className='btn btn-warning'
                  onClick={async () => {

                    try {
                      await this.props.getUserLocation();

                      await this.props.fetchDataByGeo(this.state.searchRadius);

                      this.props.mapRef.fire('geolocate', this.props.user_geo);
                    } catch (error){
                      console.error(error)
                    }
                    

                  }
                  }>Search</button>
              </>
            )
          }

          {/* TAB 2 */}
          {
            this.state.selectedTab === 2 && (
              <>

                <div className="form-group">
                  <label htmlFor="searchBox">Search for breweries:</label>
                  <input id="searchBox" className="form-control" type="text" value={this.searchBox} onChange={this.handleSearchBox} aria-describedby="searchHelp"></input>
                  <small id="searchHelp" className="form-text text-muted">Search by brewery name. For example, "Summit Brewing"</small>
                </div>
              <button
                className='btn btn-warning'
                  onClick={() => {
                    this.props.resetMapZoom();
                    this.handleSearch({ mode: 'by_name', query: this.state.searchBox });
                  }}>Search</button>
              </>
            )
          }

        </div>
      </div>
    )
  }
};

const mapState = (state) => {
  const { us_states, mapRef, selectedState, user_geo, geo } = state;
  return { us_states, mapRef, selectedState, user_geo, geo }
};

const mapDispatch = (dispatch) => {
  return {
    selectState: (selectedStateFromList) => dispatch(selectState(selectedStateFromList)),
    fetchData: (options) => dispatch(fetchData(options)),
    resetMapZoom: () => dispatch(resetMapZoom()),
    changeMode: (mode) => dispatch(changeMode(mode)),
    fetchDataByGeo: (searchRadius) => dispatch(fetchDataByGeo(searchRadius)),
    getUserLocation: () => dispatch(getUserLocation())
  }
}

export default connect(mapState, mapDispatch)(Settings);