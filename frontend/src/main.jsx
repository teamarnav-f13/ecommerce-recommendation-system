import React from 'react';
import ReactDOM from 'react-dom/client';
import { Amplify } from 'aws-amplify';
import { awsConfig } from './aws-config';
import App from './App';
import './styles/App.css';

// Configure Amplify
Amplify.configure(awsConfig);

console.log('🚀 App Starting...');
console.log('📍 Environment:', import.meta.env.MODE);
console.log('🔗 API URL:', import.meta.env.VITE_API_URL);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
