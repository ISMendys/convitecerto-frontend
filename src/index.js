import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './App';
import store from './store';
import ThemeConfig from './theme/ThemeConfig';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeConfig>
          <App />
        </ThemeConfig>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
