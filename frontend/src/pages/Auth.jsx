import React, { useState } from 'react';

const Auth = ({ onLoginSuccess }) => {
  // Setup state for inputs, loading status, and errors
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Handle form submission
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent page reload
    setError(''); // Clear previous errors
    setIsLoading(true);

    try {
      // Call your backend API
      // Make sure the URL matches your Express server's port (e.g., localhost:5000)
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // If the server returns a 400 or 401, throw the error message
        throw new Error(data.message || 'Failed to login');
      }

      // Success! Save the token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      console.log('Login successful!', data.user);
      
      // Tell App.jsx that the user is authenticated so it can show the dashboard
      onLoginSuccess();

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="glass-card w-full max-w-md p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">Welcome to AntiGaspi</h1>
          <p className="text-sm text-muted-foreground mt-2">Sign in to manage your smart fridge</p>
        </div>
        
        {/* The form handles Enter key presses automatically */}
        <form className="space-y-4" onSubmit={handleLogin}>
          
          {/* Display error message if it exists */}
          {error && (
            <div className="p-3 bg-red-100 text-red-600 text-sm rounded-xl border border-red-200">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 bg-muted/50 border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none" 
              placeholder="Enter your email" 
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 bg-muted/50 border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none" 
              placeholder="Enter your password" 
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-2 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;