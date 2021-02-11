import React from 'react';
import Banner from '../Banner/Banner';
import Map from '../Map/Map';
import Settings from '../Settings/Settings';
import styles from './App.module.scss';
import config from '../../config.json';
import BreweryList from '../BreweryList/BreweryList';

function App() {
  return (
    <div id="app" className={styles.app}>
      <Banner className={styles['banner-layout']}/>
      <div className={styles['main-container']}>
        <div className={styles['flexchild-sidebar']}>
          <Settings />
          <BreweryList />
        </div>
        <div className={styles['flexchild-map']}>
          <Map
            name='brew locator'
            version='1.0'
            accessToken={config.mapAccessToken}
          />
        </div>
        </div>
    </div>
  );
}

export default App;
