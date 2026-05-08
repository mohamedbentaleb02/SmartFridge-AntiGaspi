const express = require('express');
const recipeGenerator = require('../utils/recipeGenerator');
const FridgeItem = require('../models/FridgeItem');
const Recipe = require('../models/Recipe');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/generate', protect, async (req, res) => {
  try {
    const { dietaryRestrictions = [], preferences = {} } = req.body;

    const userFridgeItems = await FridgeItem.find({
      user: req.user._id,
      status: { $ne: 'consumed' },
      expiryDate: { $gte: new Date() }
    }).populate('product');

    const availableIngredients = userFridgeItems.map(item => ({
      name: item.product.name,
      quantity: item.quantity,
      unit: item.unit,
      expiryDate: item.expiryDate,
      category: item.product.category
    }));

    const expiringSoon = availableIngredients.filter(ingredient => {
      const daysUntilExpiry = Math.ceil((ingredient.expiryDate - new Date()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry <= 3;
    });

    const generatedRecipes = await recipeGenerator.generateAntiGaspiRecipes(
      availableIngredients.map(i => i.name),
      dietaryRestrictions,
      preferences
    );

    for (const recipe of generatedRecipes.recipes) {
      const nutritionalInfo = await recipeGenerator.calculateNutritionalValue(recipe.ingredients);
      recipe.nutritionalInfo = nutritionalInfo;
    }

    res.json({
      success: true,
      data: {
        recipes: generatedRecipes.recipes,
        availableIngredients,
        expiringSoon,
        totalIngredients: availableIngredients.length,
        urgentIngredients: expiringSoon.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.post('/optimize', protect, async (req, res) => {
  try {
    const { recipeId } = req.body;

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recette non trouvée'
      });
    }

    const userFridgeItems = await FridgeItem.find({
      user: req.user._id,
      status: { $ne: 'consumed' },
      expiryDate: { $gte: new Date() }
    }).populate('product');

    const availableIngredients = userFridgeItems.map(item => item.product.name);

    const optimizedRecipe = await recipeGenerator.optimizeRecipeForIngredients(
      recipe,
      availableIngredients
    );

    res.json({
      success: true,
      data: {
        originalRecipe: recipe,
        optimizedRecipe,
        availableIngredients
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.get('/storage-tips/:productId', protect, async (req, res) => {
  try {
    const { productId } = req.params;

    const fridgeItem = await FridgeItem.findOne({
      user: req.user._id,
      product: productId
    }).populate('product');

    if (!fridgeItem) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé dans votre réfrigérateur'
      });
    }

    const storageTips = await recipeGenerator.generateStorageTips(
      fridgeItem.product.name,
      fridgeItem.product.category,
      fridgeItem.expiryDate
    );

    res.json({
      success: true,
      data: {
        product: fridgeItem.product,
        expiryDate: fridgeItem.expiryDate,
        daysUntilExpiry: Math.ceil((fridgeItem.expiryDate - new Date()) / (1000 * 60 * 60 * 24)),
        tips: storageTips.storageTips
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.get('/meal-plan', protect, async (req, res) => {
  try {
    const { days = 7 } = req.query;

    const userFridgeItems = await FridgeItem.find({
      user: req.user._id,
      status: { $ne: 'consumed' },
      expiryDate: { $gte: new Date() }
    }).populate('product');

    const availableIngredients = userFridgeItems.map(item => item.product.name);

    const mealPlan = [];
    for (let i = 0; i < parseInt(days); i++) {
      const dailyRecipes = await recipeGenerator.generateAntiGaspiRecipes(
        availableIngredients,
        req.user.preferences?.dietaryRestrictions || [],
        req.user.preferences || {}
      );

      mealPlan.push({
        day: i + 1,
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000),
        meals: dailyRecipes.recipes.slice(0, 3)
      });
    }

    res.json({
      success: true,
      data: {
        mealPlan,
        availableIngredients: userFridgeItems.length,
        planDuration: parseInt(days)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.get('/shopping-list', protect, async (req, res) => {
  try {
    const { recipeIds } = req.query;

    if (!recipeIds) {
      return res.status(400).json({
        success: false,
        message: 'IDs des recettes requis'
      });
    }

    const recipeIdArray = recipeIds.split(',');
    const recipes = await Recipe.find({
      _id: { $in: recipeIdArray }
    });

    const userFridgeItems = await FridgeItem.find({
      user: req.user._id,
      status: { $ne: 'consumed' },
      expiryDate: { $gte: new Date() }
    }).populate('product');

    const availableIngredients = new Map();
    userFridgeItems.forEach(item => {
      const key = `${item.product.name}_${item.unit}`;
      availableIngredients.set(key, item.quantity);
    });

    const shoppingList = new Map();
    recipes.forEach(recipe => {
      recipe.ingredients.forEach(ingredient => {
        const key = `${ingredient.name}_${ingredient.unit}`;
        const available = availableIngredients.get(key) || 0;
        const needed = ingredient.quantity;
        const toBuy = Math.max(0, needed - available);

        if (toBuy > 0) {
          if (shoppingList.has(key)) {
            shoppingList.set(key, shoppingList.get(key) + toBuy);
          } else {
            shoppingList.set(key, toBuy);
          }
        }
      });
    });

    const formattedList = Array.from(shoppingList.entries()).map(([key, quantity]) => {
      const [name, unit] = key.split('_');
      return { name, quantity, unit };
    });

    res.json({
      success: true,
      data: {
        shoppingList: formattedList,
        recipesUsed: recipes.length,
        totalItems: formattedList.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
