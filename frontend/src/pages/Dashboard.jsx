import React from 'react';
import { ChefHat, AlertTriangle, TrendingUp, Refrigerator } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground m-0">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Here's what's happening in your fridge today.</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: 'Items in Fridge', value: '24', icon: Refrigerator, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { title: 'Expiring Soon', value: '3', icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10' },
          { title: 'Saved this Month', value: '$45', icon: TrendingUp, color: 'text-primary', bg: 'bg-primary/10' },
          { title: 'Recipes Available', value: '12', icon: ChefHat, color: 'text-accent', bg: 'bg-accent/10' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-6 flex flex-col gap-4 group hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground m-0">{stat.title}</h3>
              <div className={`p-2 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon size={20} />
              </div>
            </div>
            <p className="text-3xl font-bold m-0">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Urgent Items */}
        <div className="glass-card p-6 lg:col-span-3 flex flex-col">
          <h2 className="text-xl font-semibold mb-4 m-0 flex items-center gap-2">
            <AlertTriangle className="text-warning" size={20} />
            Consume Soon
          </h2>
          <div className="space-y-4 flex-1">
            {[
              { name: 'Fresh Milk', days: 1, type: 'Dairy' },
              { name: 'Spinach', days: 2, type: 'Vegetables' },
              { name: 'Chicken Breast', days: 2, type: 'Meat' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-border/50">
                <div>
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-warning">{item.days} {item.days === 1 ? 'day' : 'days'}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 text-sm text-primary font-medium hover:bg-primary/5 rounded-lg transition-colors">
            View all items →
          </button>
        </div>

        {/* Suggested Recipes */}
        <div className="glass-card p-6 lg:col-span-4 flex flex-col">
          <h2 className="text-xl font-semibold mb-4 m-0 flex items-center gap-2">
            <ChefHat className="text-accent" size={20} />
            Suggested Recipes
          </h2>
          <p className="text-sm text-muted-foreground mb-4">Based on your expiring items</p>
          
          <div className="grid sm:grid-cols-2 gap-4 flex-1">
            {[
              { name: 'Creamy Spinach Chicken', time: '30 min', match: '95%' },
              { name: 'Green Smoothie', time: '10 min', match: '100%' },
            ].map((recipe, i) => (
              <div key={i} className="relative overflow-hidden rounded-xl group cursor-pointer border border-border/50">
                <div className="h-32 bg-gradient-to-br from-zinc-800 to-zinc-900 w-full relative">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-300" />
                </div>
                <div className="p-4 bg-card">
                  <h3 className="font-medium text-sm mb-1 line-clamp-1">{recipe.name}</h3>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{recipe.time}</span>
                    <span className="text-primary font-medium">{recipe.match} match</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
