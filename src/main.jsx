import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'react-toastify/dist/ReactToastify.css';
import './index.scss';
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  // <StrictMode>
    <App />
  // </StrictMode>
);
