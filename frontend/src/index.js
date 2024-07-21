import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {ContextWrapper} from "./ContextWrapper"
import {BrowserRouter} from  'react-router-dom';

//https://episyche.com/blog/how-to-use-context-api-in-a-reactjs-app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ContextWrapper>
      <BrowserRouter>
       <App />
      </BrowserRouter>
    </ContextWrapper>
  </React.StrictMode>
);

