import React from 'react';

const Auth = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="glass-card w-full max-w-md p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">Welcome to AntiGaspi</h1>
          <p className="text-sm text-muted-foreground mt-2">Sign in to manage your smart fridge</p>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <input type="email" className="w-full p-2 bg-muted/50 border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none" placeholder="Enter your email" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <input type="password" className="w-full p-2 bg-muted/50 border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none" placeholder="Enter your password" />
          </div>
          <button className="w-full py-2 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-opacity">
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
