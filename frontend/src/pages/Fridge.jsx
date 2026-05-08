import React from 'react';
import { Search, Filter, Plus, MoreVertical, Package, Droplets, Leaf } from 'lucide-react';

const Fridge = () => {
  const items = [
    { id: 1, name: 'Fresh Milk', category: 'Dairy', expiryDays: 1, quantity: '1L', icon: Droplets, status: 'urgent' },
    { id: 2, name: 'Spinach', category: 'Vegetables', expiryDays: 2, quantity: '200g', icon: Leaf, status: 'warning' },
    { id: 3, name: 'Chicken Breast', category: 'Meat', expiryDays: 2, quantity: '500g', icon: Package, status: 'warning' },
    { id: 4, name: 'Apples', category: 'Fruits', expiryDays: 5, quantity: '6 pcs', icon: Leaf, status: 'good' },
    { id: 5, name: 'Cheddar Cheese', category: 'Dairy', expiryDays: 14, quantity: '250g', icon: Package, status: 'good' },
    { id: 6, name: 'Carrots', category: 'Vegetables', expiryDays: 7, quantity: '1kg', icon: Leaf, status: 'good' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight m-0">My Fridge</h1>
          <p className="text-muted-foreground mt-1">Manage your inventory and track expiration dates.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl hover:opacity-90 transition-opacity">
          <Plus size={20} />
          <span>Add Item</span>
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <input 
            type="text" 
            placeholder="Search items..." 
            className="w-full pl-10 pr-4 py-2 bg-card border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border/50 rounded-xl hover:bg-muted/50 transition-colors">
          <Filter size={20} />
          <span>Filter</span>
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item.id} className="glass-card p-4 flex items-center gap-4 group">
            <div className={`p-3 rounded-xl ${
              item.status === 'urgent' ? 'bg-warning/10 text-warning' : 
              item.status === 'warning' ? 'bg-orange-500/10 text-orange-500' : 
              'bg-primary/10 text-primary'
            }`}>
              <item.icon size={24} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{item.name}</h3>
                <button className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical size={16} />
                </button>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-sm text-muted-foreground">{item.quantity} • {item.category}</span>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                  item.status === 'urgent' ? 'bg-warning/10 text-warning' : 
                  item.status === 'warning' ? 'bg-orange-500/10 text-orange-500' : 
                  'bg-primary/10 text-primary'
                }`}>
                  {item.expiryDays} {item.expiryDays === 1 ? 'day' : 'days'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Fridge;
