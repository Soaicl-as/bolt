import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { InstagramProvider } from './context/InstagramContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <InstagramProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } 
            />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </Router>
    </InstagramProvider>
  );
}

export default App;