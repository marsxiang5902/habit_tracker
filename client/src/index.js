'use strict'

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Auth0Provider } from "@auth0/auth0-react";
import config from "./config";
import urljoin from 'url-join';


ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider
      domain={config.auth0_domain}
      clientId={config.auth0_client_id}
      redirectUri={urljoin(config.origin, 'callback')}
      audience={`https://${config.auth0_domain}/api/v2/`}
      scope="read:current_user update:current_user_metadata"
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
