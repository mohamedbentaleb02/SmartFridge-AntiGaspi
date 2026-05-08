import React from 'react';
import { Bell, Search } from 'lucide-react';

const Topbar = () => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 glass border-b">
      <div className="flex-1 flex items-center">
        <div className="relative w-full max-w-md hidden sm:block">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
            <Search size={18} />
          </div>
          <input
            type="text"
            className="block w-full p-2 pl-10 text-sm bg-muted/50 border border-transparent rounded-full focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-muted-foreground/70"
            placeholder="Search recipes, ingredients..."
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border-2 border-background"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-primary-foreground font-medium shadow-sm">
            JD
          </div>
          <div className="hidden md:block text-sm">
            <p className="font-medium text-foreground leading-none">John Doe</p>
            <p className="text-muted-foreground text-xs mt-1">Premium Plan</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
