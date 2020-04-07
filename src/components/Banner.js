import React from 'react';
import logo from '../assets/images/geohop.svg';

const Banner = () => {
    return (
      <div id='banner' className='px-5'>
        <img id='logo' alt='app logo'src={logo}></img>
        <h1>GeoHop</h1>
      </div>
    )
  }

  export default Banner;