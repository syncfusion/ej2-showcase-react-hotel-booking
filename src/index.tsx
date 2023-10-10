import * as React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import Home from './components/Home/Home';
import './index.css';

const root: Root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Home />
    </Provider>
  </React.StrictMode>,
);
