import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; // caso tenha uma folha de estilo global

// Seu componente principal
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
