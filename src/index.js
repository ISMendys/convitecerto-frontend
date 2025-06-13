import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import store from './store';
import { ColorModeProvider } from './theme/ThemeConfig';
import WebSocketProvider from './contexts/WebSocketContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ColorModeProvider>
          <CssBaseline />
          <WebSocketProvider>
            <App />
          </WebSocketProvider>
        </ColorModeProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
