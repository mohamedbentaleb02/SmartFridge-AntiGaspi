import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Fridge from './pages/Fridge';
import Recipes from './pages/Recipes';
import ShoppingList from './pages/ShoppingList';
import Community from './pages/Community';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import NotFound from './pages/NotFound';

function App() {
  // 1. Change the hardcoded boolean to React state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 2. Check for the token when the app loads
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  // 3. Create a function to pass down to Auth.jsx so it can update this state
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    window.history.pushState({}, '', '/');
  };

  // 4. Create a logout function (you can pass this to your Profile or Layout component later)
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  // Show a blank screen or a loading spinner while checking local storage
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // If not authenticated, show the Auth page and pass the success function
  if (!isAuthenticated) {
    return <Auth onLoginSuccess={handleLoginSuccess} />;
  }

  // If authenticated, show the main app
  return (
    <Router>
      {/* You might want to pass handleLogout to Layout or Profile later! */}
      <Layout onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/fridge" element={<Fridge />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/shopping-list" element={<ShoppingList />} />
          <Route path="/community" element={<Community />} />
          <Route path="/profile" element={<Profile onLogout={handleLogout} />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/login" element={<Auth />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;