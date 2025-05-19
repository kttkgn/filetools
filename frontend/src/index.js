import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// 配置 React Router 未来标志
const routerConfig = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter {...routerConfig}>
    <App />
  </BrowserRouter>,
);
