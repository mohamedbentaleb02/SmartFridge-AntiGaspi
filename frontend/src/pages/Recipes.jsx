import React from 'react';
import { Search, Filter, Clock, Star, Heart, ChefHat } from 'lucide-react';

const Recipes = () => {
  const recipes = [
    {
      id: 1,
      name: 'Creamy Spinach Chicken',
      description: 'A delicious way to use up your expiring spinach and chicken breast.',
      time: '30 min',
      difficulty: 'Easy',
      match: '95%',
      likes: 124,
      image: 'from-orange-500/20 to-red-500/20'
    },
    {
      id: 2,
      name: 'Green Power Smoothie',
      description: 'Quick and healthy breakfast using fresh spinach and apples.',
      time: '10 min',
      difficulty: 'Easy',
      match: '100%',
      likes: 89,
      image: 'from-green-500/20 to-emerald-500/20'
    },
    {
      id: 3,
      name: 'Cheesy Vegetable Bake',
      description: 'Comfort food that helps clear out vegetables and cheese.',
      time: '45 min',
      difficulty: 'Medium',
      match: '75%',
      likes: 256,
      image: 'from-yellow-500/20 to-orange-500/20'
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight m-0">Smart Recipes</h1>
          <p className="text-muted-foreground mt-1">Meals generated based on what's in your fridge.</p>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <input 
            type="text" 
            placeholder="Search recipes..." 
            className="w-full pl-10 pr-4 py-2 bg-card border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border/50 rounded-xl hover:bg-muted/50 transition-colors">
          <Filter size={20} />
          <span>Filters</span>
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="glass-card overflow-hidden group cursor-pointer flex flex-col">
            <div className={`h-48 bg-gradient-to-br ${recipe.image} w-full relative flex items-center justify-center`}>
              <ChefHat size={48} className="text-foreground/20 group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute top-4 right-4 bg-background/80 backdrop-blur px-2 py-1 rounded-lg text-sm font-bold text-primary border border-border/50">
                {recipe.match} Match
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg line-clamp-1">{recipe.name}</h3>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                {recipe.description}
              </p>
              <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t border-border/50">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1"><Clock size={16} /> {recipe.time}</span>
                  <span className="flex items-center gap-1"><Star size={16} /> {recipe.difficulty}</span>
                </div>
                <div className="flex items-center gap-1 hover:text-warning transition-colors">
                  <Heart size={16} /> {recipe.likes}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recipes;
