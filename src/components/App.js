import React, {useState, useEffect} from 'react';
import Banner from './Banner';
import Map from './Map';
import Settings from './Settings';
import store from '../reducers/rootReducer';
import { fetchData } from '../actions';

function App() {
  useEffect(()=>{
    store.dispatch(fetchData())
  })
  return (
    <div id="app">
      <Banner />
        <Map 
          name = 'brew locator'
          version = '1.0'
          token = 'J7d3zBQRTzALvaND8bHNYzOYtM2w1GBn'
          />
        <Settings />
    </div>
  );
}

export default App;
