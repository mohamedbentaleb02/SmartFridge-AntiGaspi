const express = require('express');
const FridgeItem = require('../models/FridgeItem');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const { status, location, page = 1, limit = 10 } = req.query;
    
    let query = { user: req.user._id };
    
    if (status) {
      query.status = status;
    }
    
    if (location) {
      query.location = location;
    }

    const items = await FridgeItem.find(query)
      .populate('product')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ expiryDate: 1 });

    const total = await FridgeItem.countDocuments(query);

    res.json({
      success: true,
      count: items.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: items
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.get('/expiring-soon', protect, async (req, res) => {
  try {
    const { days = 3 } = req.query;
    
    const items = await FridgeItem.getExpiringSoon(req.user._id, parseInt(days));

    res.json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.get('/expired', protect, async (req, res) => {
  try {
    const items = await FridgeItem.getExpired(req.user._id);

    res.json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const item = await FridgeItem.findById(req.params.id)
      .populate('product');
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Fridge item not found'
      });
    }

    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this item'
      });
    }

    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const { productId, ...itemData } = req.body;
    
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const fridgeItemData = {
      ...itemData,
      user: req.user._id,
      product: productId
    };

    const item = await FridgeItem.create(fridgeItemData);
    
    const populatedItem = await FridgeItem.findById(item._id)
      .populate('product');

    res.status(201).json({
      success: true,
      data: populatedItem
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const item = await FridgeItem.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Fridge item not found'
      });
    }

    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this item'
      });
    }

    const updatedItem = await FridgeItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('product');

    res.json({
      success: true,
      data: updatedItem
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const item = await FridgeItem.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Fridge item not found'
      });
    }

    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this item'
      });
    }

    await FridgeItem.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.post('/:id/consume', protect, async (req, res) => {
  try {
    const { quantity } = req.body;
    
    const item = await FridgeItem.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Fridge item not found'
      });
    }

    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this item'
      });
    }

    if (quantity && quantity > item.quantity) {
      return res.status(400).json({
        success: false,
        message: 'Cannot consume more than available quantity'
      });
    }

    if (quantity && quantity < item.quantity) {
      item.quantity -= quantity;
      await item.save();
    } else {
      item.status = 'consumed';
      await item.save();
    }

    const updatedItem = await FridgeItem.findById(item._id)
      .populate('product');

    res.json({
      success: true,
      data: updatedItem
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

router.get('/stats/summary', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    
    const totalItems = await FridgeItem.countDocuments({ 
      user: userId, 
      status: { $ne: 'consumed' } 
    });
    
    const expiringSoon = await FridgeItem.getExpiringSoon(userId, 3);
    const expired = await FridgeItem.getExpired(userId);
    
    const itemsByCategory = await FridgeItem.aggregate([
      { $match: { user: userId, status: { $ne: 'consumed' } } },
      { $lookup: { from: 'products', localField: 'product', foreignField: '_id', as: 'product' } },
      { $unwind: '$product' },
      { $group: { _id: '$product.category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        totalItems,
        expiringSoonCount: expiringSoon.length,
        expiredCount: expired.length,
        itemsByCategory
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
