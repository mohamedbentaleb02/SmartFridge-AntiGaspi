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
  // Simple auth check for prototype
  const isAuthenticated = true;

  if (!isAuthenticated) {
    return <Auth />;
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/fridge" element={<Fridge />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/shopping-list" element={<ShoppingList />} />
          <Route path="/community" element={<Community />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
