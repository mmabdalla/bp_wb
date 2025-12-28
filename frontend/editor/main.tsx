// BP_WB Editor - Main Entry Point
// This file will be implemented in WB-002: Basic Editor UI Layout

import React from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  return (
    <div>
      <h1>BP_WB Editor</h1>
      <p>Editor will be implemented in WB-002</p>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

