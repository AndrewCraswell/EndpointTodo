import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { SnackbarProvider } from 'notistack';

import App from './App';
import { store } from './store';
import { UseCacheProvider } from './components/UseCacheProvider';

import './index.scss';

ReactDOM.render(
  <Provider store={store}>
    <SnackbarProvider maxSnack={3} dense>
      <UseCacheProvider>
        <App />
      </UseCacheProvider>
    </SnackbarProvider>
  </Provider>,
  document.getElementById('root')
);

