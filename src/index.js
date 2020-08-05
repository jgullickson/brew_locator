import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App/App';
import * as serviceWorker from './serviceWorker';
import store from './redux/reducers/rootReducer';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css';
import './styles/global.scss';
import 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/images/marker-icon.png';
// import $ from 'jquery';
// import Popper from '@popperjs/core';
import 'bootstrap/dist/js/bootstrap.bundle.min';


ReactDOM.render(
<Provider store={store}>
    <App />
</Provider>, 
document.getElementById('root'));

serviceWorker.unregister();