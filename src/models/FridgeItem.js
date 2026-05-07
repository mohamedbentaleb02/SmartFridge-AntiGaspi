const mongoose = require('mongoose');

const fridgeItemSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative']
  },
  unit: {
    type: String,
    required: true,
    enum: ['g', 'kg', 'ml', 'l', 'piece', 'pack']
  },
  purchaseDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  expiryDate: {
    type: Date,
    required: [true, 'Expiry date is required']
  },
  openedDate: {
    type: Date,
    default: null
  },
  location: {
    type: String,
    enum: ['refrigerator', 'freezer', 'pantry', 'counter'],
    required: true
  },
  status: {
    type: String,
    enum: ['fresh', 'expiring-soon', 'expired', 'consumed'],
    default: 'fresh'
  },
  notes: {
    type: String,
    maxlength: [200, 'Notes cannot exceed 200 characters']
  },
  price: {
    type: Number,
    min: 0
  },
  store: {
    type: String,
    trim: true,
    maxlength: [50, 'Store name cannot exceed 50 characters']
  }
}, {
  timestamps: true
});

fridgeItemSchema.index({ user: 1, expiryDate: 1 });
fridgeItemSchema.index({ user: 1, status: 1 });
fridgeItemSchema.index({ user: 1, product: 1 });

fridgeItemSchema.pre('save', function(next) {
  const now = new Date();
  const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
  
  if (this.expiryDate < now) {
    this.status = 'expired';
  } else if (this.expiryDate <= threeDaysFromNow) {
    this.status = 'expiring-soon';
  } else {
    this.status = 'fresh';
  }
  
  next();
});

fridgeItemSchema.methods.updateStatus = function() {
  const now = new Date();
  const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
  
  if (this.expiryDate < now) {
    this.status = 'expired';
  } else if (this.expiryDate <= threeDaysFromNow) {
    this.status = 'expiring-soon';
  } else {
    this.status = 'fresh';
  }
  
  return this.save();
};

fridgeItemSchema.statics.getExpiringSoon = function(userId, days = 3) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() + days);
  
  return this.find({
    user: userId,
    expiryDate: { $lte: cutoffDate },
    status: { $ne: 'expired' }
  }).populate('product');
};

fridgeItemSchema.statics.getExpired = function(userId) {
  const now = new Date();
  return this.find({
    user: userId,
    expiryDate: { $lt: now },
    status: { $ne: 'expired' }
  }).populate('product');
};

module.exports = mongoose.model('FridgeItem', fridgeItemSchema);
