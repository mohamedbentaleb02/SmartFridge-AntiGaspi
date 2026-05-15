import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Refrigerator, 
  ChefHat, 
  ShoppingCart, 
  Users, 
  UserCircle,
  LogOut,
  Bell
} from 'lucide-react';
import { cn } from '../../lib/utils';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'My Fridge', path: '/fridge', icon: Refrigerator },
    { name: 'Recipes', path: '/recipes', icon: ChefHat },
    { name: 'Shopping List', path: '/shopping-list', icon: ShoppingCart },
    { name: 'Community', path: '/community', icon: Users },
  ];

  return (
    <aside className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0 glass border-r">
      <div className="h-full px-4 py-6 flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 px-2 mb-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-emerald-300 flex items-center justify-center text-primary-foreground shadow-lg">
            <Refrigerator size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-emerald-600">
              AntiGaspi
            </h1>
            <p className="text-xs text-muted-foreground">Smart Fridge</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                  isActive 
                    ? "text-primary bg-primary/10 font-medium" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon 
                    size={20} 
                    className={cn(
                      "transition-transform duration-200",
                      isActive ? "scale-110" : "group-hover:scale-110"
                    )} 
                  />
                  <span>{item.name}</span>
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="mt-auto pt-6 border-t border-border space-y-2">
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                isActive 
                  ? "text-primary bg-primary/10 font-medium" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )
            }
          >
            <UserCircle size={20} />
            <span>Profile</span>
          </NavLink>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
