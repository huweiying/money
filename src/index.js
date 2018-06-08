import React from 'react';
import ReactDOM from 'react-dom';
import Routers from './router/router'
import { HashRouter, Route } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'
import './assets/css/common.css';
import publics from "./assets/js/public";
// import Header from "./component/header"
import registerServiceWorker from './registerServiceWorker';



ReactDOM.render((
  <HashRouter>
    {renderRoutes(Routers)}
  </HashRouter>
  ), document.getElementById('root'));
  
registerServiceWorker();
