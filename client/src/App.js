import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearAuth } from './store/slices/authSlice';
import { setConnectionStatus } from './store/slices/chatSlice';
import socketService from './services/socket';
import firebaseAuthService from './services/firebaseAuth';

// Components
import ChatLayout from './components/Layout/ChatLayout';
import TranslationInterface from './components/Translation/TranslationInterface';
import Dashboard from './components/Dashboard/Dashboard';
import SimpleLayout from './components/Layout/SimpleLayout';
import EnhancedHomepage from './components/Home/EnhancedHomepage';
import LiveExperiencePage from './components/Live/LiveExperiencePage';

// App Content Component
function AppContent() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    // Set up Firebase auth state listener
    const unsubscribe = firebaseAuthService.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userData = await firebaseAuthService.getCurrentUser();
          if (userData) {
            dispatch(setUser(userData));
          }
        } catch (error) {
          console.error('Error getting user data:', error);
          dispatch(clearAuth());
        }
      } else {
        dispatch(clearAuth());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  useEffect(() => {
    if (token) {
      // Initialize socket connection
      socketService.connect(token);
      dispatch(setConnectionStatus(true));

      // Cleanup on unmount
      return () => {
        socketService.disconnect();
        dispatch(setConnectionStatus(false));
      };
    }
  }, [token, dispatch]);

  return (
    <Router>
      <SimpleLayout>
        <div className="App h-screen bg-gray-50 dark:bg-gray-900">
          <Routes>
            {/* Main Routes */}
            <Route
              path="/"
              element={<EnhancedHomepage />}
            />
            <Route
              path="/dashboard"
              element={<Dashboard />}
            />
            <Route
              path="/translate"
              element={<TranslationInterface />}
            />
            <Route
              path="/chat"
              element={<ChatLayout />}
            />
            <Route
              path="/chat/:roomId"
              element={<ChatLayout />}
            />
            <Route
              path="/live"
              element={<LiveExperiencePage />}
            />

            {/* Catch all route */}
            <Route
              path="*"
              element={
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                    <p className="text-gray-600 mb-4">Page not found</p>
                    <button
                      onClick={() => window.history.back()}
                      className="btn-primary"
                    >
                      Go Back
                    </button>
                  </div>
                </div>
              }
            />
          </Routes>
        </div>
      </SimpleLayout>
    </Router>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
