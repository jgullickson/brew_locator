import React from 'react';
import logo from '../../assets/images/geohop.svg';
// import logo2 from '../assets/images/geohop-green-bg.png';
import styles from './Banner.module.scss';

const Banner = () => {
    return (
      <div id='banner' className={`${styles.banner}`}>
        <img className={styles.logo} alt='app logo' src={logo}></img>
        <div>
          <h1>GeoHop</h1>
          <h2>Powered by OpenBreweryDB</h2>
        </div>
      </div>
    )
  }

  export default Banner;