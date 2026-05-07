const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Recipe title is required'],
    trim: true,
    maxlength: [100, 'Recipe title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Recipe description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  ingredients: [{
    name: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 0
    },
    unit: {
      type: String,
      required: true,
      enum: ['g', 'kg', 'ml', 'l', 'cup', 'tbsp', 'tsp', 'piece', 'pinch']
    },
    optional: {
      type: Boolean,
      default: false
    }
  }],
  instructions: [{
    step: {
      type: Number,
      required: true
    },
    instruction: {
      type: String,
      required: true,
      maxlength: [500, 'Instruction cannot exceed 500 characters']
    }
  }],
  prepTime: {
    type: Number,
    required: [true, 'Preparation time is required'],
    min: 1
  },
  cookTime: {
    type: Number,
    required: [true, 'Cooking time is required'],
    min: 0
  },
  servings: {
    type: Number,
    required: [true, 'Number of servings is required'],
    min: 1
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snack', 'dessert', 'beverage'],
    required: [true, 'Recipe category is required']
  },
  dietaryFlags: [{
    type: String,
    enum: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'nut-free', 'halal', 'kosher']
  }],
  allergens: [{
    type: String,
    enum: ['gluten', 'dairy', 'nuts', 'peanuts', 'soy', 'eggs', 'fish', 'shellfish', 'sesame']
  }],
  imageUrl: {
    type: String,
    default: null
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

recipeSchema.index({ title: 'text', description: 'text' });
recipeSchema.index({ category: 1 });
recipeSchema.index({ difficulty: 1 });
recipeSchema.index({ dietaryFlags: 1 });
recipeSchema.index({ author: 1 });

recipeSchema.methods.updateRating = function(newRating) {
  const totalRating = this.rating.average * this.rating.count + newRating;
  this.rating.count += 1;
  this.rating.average = totalRating / this.rating.count;
  return this.save();
};

module.exports = mongoose.model('Recipe', recipeSchema);
