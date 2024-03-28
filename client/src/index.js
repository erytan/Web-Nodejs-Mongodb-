import React from 'react';
import { createRoot } from 'react-dom';
import { Provider } from 'react-redux';
import { store, persistor } from './store/redux'; // Sửa lại tên biến `perstistor` thành `persistor`
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';

const container = document.getElementById('root');
const root = createRoot(container); // Sửa lại từ `createRoot` thành `createRoot`

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}> {/* Sửa lại biến `perstistor` thành `persistor` */}
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
