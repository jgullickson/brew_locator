import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import store from './reducers/rootReducer';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

ReactDOM.render(
<Provider store={store}>
    <App />
</Provider>, 
document.getElementById('root'));

serviceWorker.unregister();
