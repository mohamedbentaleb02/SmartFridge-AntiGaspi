import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <p className="text-xl text-muted-foreground">Page not found</p>
      <Link 
        to="/" 
        className="px-6 py-2 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity"
      >
        Go back home
      </Link>
    </div>
  );
};

export default NotFound;
