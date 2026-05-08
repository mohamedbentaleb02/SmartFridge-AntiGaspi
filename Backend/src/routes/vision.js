const express = require('express');
const multer = require('multer');
const imageProcessor = require('../utils/imageProcessor');
const Product = require('../models/Product');
const FridgeItem = require('../models/FridgeItem');
const { protect } = require('../middleware/auth');

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Seuls les fichiers image sont autorisés'), false);
    }
  }
});

router.post('/scan-receipt', protect, upload.single('receipt'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Aucune image fournie'
      });
    }

    await imageProcessor.validateImage(req.file.buffer);
    const receiptData = await imageProcessor.processReceipt(req.file.buffer);

    const processedItems = [];
    for (const item of receiptData.items) {
      const existingProduct = await Product.findOne({
        $or: [
          { name: { $regex: item.name, $options: 'i' } },
          { brand: { $regex: item.name, $options: 'i' } }
        ]
      });

      if (existingProduct) {
        processedItems.push({
          product: existingProduct._id,
          quantity: item.quantity,
          unit: item.unit,
          price: item.price,
          purchaseDate: receiptData.date,
          expiryDate: new Date(receiptData.date.getTime() + (existingProduct.storageInfo?.shelfLifeDays || 7) * 24 * 60 * 60 * 1000),
          location: existingProduct.storageInfo?.storageLocation || 'refrigerator'
        });
      } else {
        processedItems.push({
          productName: item.name,
          quantity: item.quantity,
          unit: item.unit,
          price: item.price,
          purchaseDate: receiptData.date
        });
      }
    }

    res.json({
      success: true,
      data: {
        receipt: receiptData,
        items: processedItems,
        totalItems: processedItems.length
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

router.post('/recognize-product', protect, upload.single('product'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Aucune image fournie'
      });
    }

    await imageProcessor.validateImage(req.file.buffer);
    const productInfo = await imageProcessor.recognizeProduct(req.file.buffer);

    let product = null;
    if (productInfo.barcode) {
      product = await Product.findOne({ barcode: productInfo.barcode });
    }

    if (!product && productInfo.name) {
      product = await Product.findOne({
        name: { $regex: productInfo.name, $options: 'i' }
      });
    }

    res.json({
      success: true,
      data: {
        recognized: productInfo,
        matchedProduct: product,
        confidence: product ? 'high' : 'medium'
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

router.post('/add-from-receipt', protect, async (req, res) => {
  try {
    const { items } = req.body;
    
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Aucun article à ajouter'
      });
    }

    const addedItems = [];
    const errors = [];

    for (const item of items) {
      try {
        if (item.product) {
          const fridgeItem = await FridgeItem.create({
            user: req.user._id,
            product: item.product,
            quantity: item.quantity,
            unit: item.unit,
            purchaseDate: item.purchaseDate,
            expiryDate: item.expiryDate,
            location: item.location,
            price: item.price
          });

          const populatedItem = await FridgeItem.findById(fridgeItem._id)
            .populate('product');
          
          addedItems.push(populatedItem);
        } else {
          errors.push({
            item: item.productName,
            message: 'Produit non trouvé dans la base de données'
          });
        }
      } catch (error) {
        errors.push({
          item: item.productName || 'Inconnu',
          message: error.message
        });
      }
    }

    res.json({
      success: true,
      data: {
        addedItems,
        errors,
        totalAdded: addedItems.length,
        totalErrors: errors.length
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

router.get('/product-suggestions', protect, async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Requête manquante'
      });
    }

    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { brand: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    }).limit(10);

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
