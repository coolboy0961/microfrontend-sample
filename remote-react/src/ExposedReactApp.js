// src/ExposedReactApp.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

export function renderReactApp(elSelector) {
  const root = ReactDOM.createRoot(document.querySelector(elSelector));
  root.render(<App />);
}