import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { CssBaseline } from '@material-ui/core';

import App from './components/App';
import { store } from './store';
import { UseCacheProvider } from './components/UseCacheProvider';

import './index.scss';

ReactDOM.render(
  <Provider store={store}>
    <CssBaseline />
    <Router>
      <UseCacheProvider>
        <App />
      </UseCacheProvider>
    </Router>
  </Provider>,
  document.getElementById('root')
);

