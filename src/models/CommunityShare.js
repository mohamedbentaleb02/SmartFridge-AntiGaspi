const mongoose = require('mongoose');

const communityShareSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  product: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    brand: String,
    category: {
      type: String,
      enum: ['fruits', 'vegetables', 'dairy', 'meat', 'bakery', 'beverages', 'frozen', 'pantry', 'other'],
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    unit: {
      type: String,
      enum: ['kg', 'g', 'l', 'ml', 'pieces', 'box', 'bottle'],
      required: true
    },
    expiryDate: {
      type: Date,
      required: true
    },
    condition: {
      type: String,
      enum: ['excellent', 'good', 'fair'],
      required: true
    },
    images: [{
      url: String,
      description: String
    }]
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    },
    address: {
      street: String,
      city: String,
      postalCode: String,
      country: String
    }
  },
  availabilityWindow: {
    start: {
      type: Date,
      required: true
    },
    end: {
      type: Date,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['available', 'reserved', 'collected', 'expired'],
    default: 'available'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  description: {
    type: String,
    maxlength: 300
  },
  images: [{
    url: String,
    description: String
  }],
  reservationHistory: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reservedAt: Date,
    cancelledAt: Date,
    notes: String
  }],
  donorRating: {
    type: Number,
    min: 1,
    max: 5
  },
  recipientRating: {
    type: Number,
    min: 1,
    max: 5
  },
  feedback: String,
  donorNotified: { type: Boolean, default: false },
  recipientNotified: { type: Boolean, default: false }
}, {
  timestamps: true
});

communityShareSchema.index({ location: '2dsphere' });
communityShareSchema.index({ status: 1, 'availabilityWindow.end': 1 });
communityShareSchema.index({ donor: 1 });
communityShareSchema.index({ recipient: 1 });
communityShareSchema.index({ priority: 1, status: 1 });

communityShareSchema.methods.isAvailable = function() {
  const now = new Date();
  return this.status === 'available' && 
         this.availabilityWindow.start <= now && 
         this.availabilityWindow.end >= now;
};

communityShareSchema.methods.canBeReserved = function(userId) {
  return this.isAvailable() && 
         this.donor.toString() !== userId.toString();
};

communityShareSchema.methods.reserve = function(userId) {
  if (!this.canBeReserved(userId)) {
    throw new Error('Item cannot be reserved');
  }
  
  this.recipient = userId;
  this.status = 'reserved';
  this.reservationHistory.push({
    user: userId,
    reservedAt: new Date()
  });
  
  return this.save();
};

communityShareSchema.methods.cancelReservation = function() {
  this.recipient = null;
  this.status = 'available';
  
  if (this.reservationHistory.length > 0) {
    this.reservationHistory[this.reservationHistory.length - 1].cancelledAt = new Date();
  }
  
  return this.save();
};

communityShareSchema.methods.markAsCollected = function() {
  this.status = 'collected';
  return this.save();
};

module.exports = mongoose.model('CommunityShare', communityShareSchema);
