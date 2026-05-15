import React, { useState, useEffect } from 'react';
import { User, Settings, Bell, Shield, LogOut, TrendingUp, Leaf, DollarSign } from 'lucide-react';

// 1. Accept the onLogout prop
const Profile = ({ onLogout }) => {
  // 2. State to hold the logged-in user's data
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Grab the user data we saved during login
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  }, []);

  // Safe fallbacks while loading or if data is missing
  const firstName = userData?.firstName || 'John';
  const lastName = userData?.lastName || 'Doe';
  const email = userData?.email || 'john.doe@example.com';
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight m-0 mb-8">Your Profile</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          {/* Profile Card */}
          <div className="glass-card p-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl text-primary-foreground font-bold mb-4">
              {initials}
            </div>
            <h2 className="text-xl font-bold">{firstName} {lastName}</h2>
            <p className="text-muted-foreground text-sm mb-4">{email}</p>
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium border border-primary/20">
              Eco Warrior
            </span>
          </div>

          {/* Navigation */}
          <div className="glass-card overflow-hidden">
            {[
              { icon: User, label: 'Personal Information' },
              { icon: Bell, label: 'Notifications' },
              { icon: Shield, label: 'Privacy & Security' },
              { icon: Settings, label: 'App Settings' },
            ].map((item, i) => (
              <button key={i} className="w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors border-b border-border/50 last:border-0 text-left">
                <item.icon size={18} className="text-muted-foreground" />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          {/* Stats */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4">Your Impact</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="p-4 bg-muted/50 rounded-xl border border-border/50 text-center">
                <div className="w-10 h-10 mx-auto bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-2">
                  <Leaf size={20} />
                </div>
                <p className="text-2xl font-bold">45kg</p>
                <p className="text-xs text-muted-foreground">Food Saved</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-xl border border-border/50 text-center">
                <div className="w-10 h-10 mx-auto bg-primary/10 text-primary rounded-full flex items-center justify-center mb-2">
                  <DollarSign size={20} />
                </div>
                <p className="text-2xl font-bold">$120</p>
                <p className="text-xs text-muted-foreground">Money Saved</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-xl border border-border/50 text-center">
                <div className="w-10 h-10 mx-auto bg-accent/10 text-accent rounded-full flex items-center justify-center mb-2">
                  <TrendingUp size={20} />
                </div>
                <p className="text-2xl font-bold">Top 5%</p>
                <p className="text-xs text-muted-foreground">In Community</p>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4">Dietary Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Vegetarian</p>
                  <p className="text-sm text-muted-foreground">Show only vegetarian recipes</p>
                </div>
                <div className="w-12 h-6 bg-muted rounded-full relative cursor-pointer border border-border">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-muted-foreground rounded-full transition-all"></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Allergy Alerts</p>
                  <p className="text-sm text-muted-foreground">Notify about configured allergens</p>
                </div>
                <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer border border-primary">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-background rounded-full transition-all shadow-sm"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 3. Attach the onLogout prop to the onClick event */}
          <button 
            onClick={onLogout}
            className="w-full py-3 flex items-center justify-center gap-2 text-destructive font-medium bg-destructive/10 hover:bg-destructive/20 rounded-xl transition-colors"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;