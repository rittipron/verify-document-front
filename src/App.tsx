// src/App.tsx
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import AppRouter from './Router';
import { store } from './redux/store';
import ErrorBoundary from './ErrorBoundary';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <ErrorBoundary>
          <AppRouter />
        </ErrorBoundary>
      </Router>
    </Provider>
  );
};

export default App;
