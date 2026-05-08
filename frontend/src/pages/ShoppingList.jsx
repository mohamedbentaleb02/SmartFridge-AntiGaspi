import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';

const ShoppingList = () => {
  const [items, setItems] = useState([
    { id: 1, name: 'Eggs', category: 'Dairy', quantity: '1 dozen', checked: false },
    { id: 2, name: 'Whole Wheat Bread', category: 'Bakery', quantity: '1 loaf', checked: false },
    { id: 3, name: 'Tomatoes', category: 'Vegetables', quantity: '500g', checked: true },
    { id: 4, name: 'Olive Oil', category: 'Pantry', quantity: '1 bottle', checked: false },
    { id: 5, name: 'Greek Yogurt', category: 'Dairy', quantity: '400g', checked: true },
  ]);

  const toggleCheck = (id) => {
    setItems(items.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight m-0">Shopping List</h1>
          <p className="text-muted-foreground mt-1">Smart suggestions based on your usage patterns.</p>
        </div>
      </div>

      <div className="glass-card p-6">
        <div className="flex gap-4 mb-6">
          <input 
            type="text" 
            placeholder="Add new item..." 
            className="flex-1 px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <button className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity font-medium">
            <Plus size={20} />
            <span className="hidden sm:inline">Add Item</span>
          </button>
        </div>

        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} 
                 className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                   item.checked ? 'bg-muted/30 border-transparent opacity-60' : 'bg-card border-border/50 shadow-sm'
                 }`}>
              <div className="flex items-center gap-4 cursor-pointer flex-1" onClick={() => toggleCheck(item.id)}>
                <button className={`focus:outline-none ${item.checked ? 'text-primary' : 'text-muted-foreground'}`}>
                  {item.checked ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                </button>
                <div>
                  <h3 className={`font-medium ${item.checked ? 'line-through text-muted-foreground' : ''}`}>
                    {item.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{item.quantity} • {item.category}</p>
                </div>
              </div>
              <button className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShoppingList;
