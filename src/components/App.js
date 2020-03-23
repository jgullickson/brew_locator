import React from 'react';
import Banner from './Banner';
import Map from './Map';
import Settings from './Settings';

function App() {
  return (
    <div id="app">
      <Banner />
        <div id="main-container">
        <Map 
          name = 'brew locator'
          version = '1.0'
          token = 'J7d3zBQRTzALvaND8bHNYzOYtM2w1GBn'
          />
        <Settings />
        </div>
    </div>
  );
}

export default App;
