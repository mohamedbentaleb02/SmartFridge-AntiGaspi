const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['fruits', 'vegetables', 'dairy', 'meat', 'fish', 'grains', 'beverages', 'snacks', 'frozen', 'condiments', 'other']
  },
  barcode: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  brand: {
    type: String,
    trim: true,
    maxlength: [50, 'Brand name cannot exceed 50 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  nutritionalInfo: {
    calories: { type: Number, min: 0 },
    protein: { type: Number, min: 0 },
    carbs: { type: Number, min: 0 },
    fat: { type: Number, min: 0 },
    fiber: { type: Number, min: 0 },
    sugar: { type: Number, min: 0 },
    sodium: { type: Number, min: 0 }
  },
  allergens: [{
    type: String,
    enum: ['gluten', 'dairy', 'nuts', 'peanuts', 'soy', 'eggs', 'fish', 'shellfish', 'sesame']
  }],
  dietaryFlags: [{
    type: String,
    enum: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'nut-free', 'halal', 'kosher']
  }],
  storageInfo: {
    idealTemperature: { type: Number },
    humidity: { type: Number, min: 0, max: 100 },
    storageLocation: {
      type: String,
      enum: ['refrigerator', 'freezer', 'pantry', 'counter']
    },
    shelfLifeDays: { type: Number, min: 1 }
  },
  imageUrl: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

productSchema.index({ name: 'text', brand: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ barcode: 1 });

module.exports = mongoose.model('Product', productSchema);
