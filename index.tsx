
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

function renderApp() {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

fetch('/api/config')
  .then(res => res.json())
  .then(data => {
    if (data.apiKey) {
      if (typeof window !== 'undefined') {
        (window as any).process = (window as any).process || {};
        (window as any).process.env = (window as any).process.env || {};
        (window as any).process.env.API_KEY = data.apiKey;
      }
    }
    renderApp();
  })
  .catch(err => {
    console.error('Failed to fetch config:', err);
    renderApp();
  });