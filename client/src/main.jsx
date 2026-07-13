import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { SiteProvider } from './context/SiteContext';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <SiteProvider>
        <App />
      </SiteProvider>
    </HashRouter>
  </React.StrictMode>
);
