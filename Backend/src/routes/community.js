const express = require('express');
const multer = require('multer');
const CommunityShare = require('../models/CommunityShare');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Seuls les fichiers image sont autorisés'), false);
    }
  }
});

router.post('/share', protect, upload.array('images', 3), async (req, res) => {
  try {
    const {
      items,
      address,
      pickupInstructions,
      availabilityWindow,
      priority = 'normal',
      restrictions = {}
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Au moins un article est requis'
      });
    }

    const parsedItems = JSON.parse(items);
    const parsedAddress = JSON.parse(address);
    const parsedAvailabilityWindow = JSON.parse(availabilityWindow);
    const parsedRestrictions = JSON.parse(restrictions);

    const shareData = {
      donor: req.user._id,
      items: parsedItems,
      location: {
        address: parsedAddress,
        coordinates: [parsedAddress.longitude, parsedAddress.latitude]
      },
      pickupInstructions,
      availabilityWindow: {
        start: new Date(parsedAvailabilityWindow.start),
        end: new Date(parsedAvailabilityWindow.end)
      },
      priority,
      restrictions: parsedRestrictions
    };

    if (req.files && req.files.length > 0) {
      shareData.images = req.files.map((file, index) => ({
        url: `/uploads/community/${Date.now()}_${index}.${file.originalname.split('.').pop()}`,
        description: `Image ${index + 1} du partage`
      }));
    }

    const share = await CommunityShare.create(shareData);
    const populatedShare = await CommunityShare.findById(share._id)
      .populate('donor', 'username firstName lastName')
      .populate('items.product', 'name category imageUrl');

    res.status(201).json({
      success: true,
      data: populatedShare
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

router.get('/nearby', protect, async (req, res) => {
  try {
    const { 
      longitude, 
      latitude, 
      maxDistance = 10000,
      page = 1,
      limit = 10 
    } = req.query;

    if (!longitude || !latitude) {
      return res.status(400).json({
        success: false,
        message: 'Coordonnées GPS requises'
      });
    }

    const shares = await CommunityShare.findNearby(
      parseFloat(longitude),
      parseFloat(latitude),
      parseInt(maxDistance)
    )
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ priority: -1, 'availabilityWindow.start': 1 });

    const total = await CommunityShare.countDocuments({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      },
      status: 'available',
      'availabilityWindow.end': { $gte: new Date() }
    });

    res.json({
      success: true,
      count: shares.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: shares
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.get('/urgent', protect, async (req, res) => {
  try {
    const urgentShares = await CommunityShare.findUrgent()
      .populate('donor', 'username firstName lastName')
      .populate('items.product', 'name category imageUrl');

    res.json({
      success: true,
      count: urgentShares.length,
      data: urgentShares
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.post('/:id/reserve', protect, async (req, res) => {
  try {
    const share = await CommunityShare.findById(req.params.id)
      .populate('donor', 'username firstName lastName email');

    if (!share) {
      return res.status(404).json({
        success: false,
        message: 'Partage non trouvé'
      });
    }

    await share.reserve(req.user._id);

    const populatedShare = await CommunityShare.findById(share._id)
      .populate('donor', 'username firstName lastName')
      .populate('recipient', 'username firstName lastName')
      .populate('items.product', 'name category imageUrl');

    res.json({
      success: true,
      data: populatedShare,
      message: 'Partage réservé avec succès'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

router.post('/:id/cancel', protect, async (req, res) => {
  try {
    const share = await CommunityShare.findById(req.params.id);

    if (!share) {
      return res.status(404).json({
        success: false,
        message: 'Partage non trouvé'
      });
    }

    await share.cancelReservation(req.user._id);

    const populatedShare = await CommunityShare.findById(share._id)
      .populate('donor', 'username firstName lastName')
      .populate('items.product', 'name category imageUrl');

    res.json({
      success: true,
      data: populatedShare,
      message: 'Réservation annulée avec succès'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

router.post('/:id/collect', protect, async (req, res) => {
  try {
    const share = await CommunityShare.findById(req.params.id)
      .populate('donor', 'username firstName lastName')
      .populate('recipient', 'username firstName lastName');

    if (!share) {
      return res.status(404).json({
        success: false,
        message: 'Partage non trouvé'
      });
    }

    await share.markAsCollected(req.user._id);

    res.json({
      success: true,
      data: share,
      message: 'Collecte confirmée avec succès'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

router.get('/my-shares', protect, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    let query = { donor: req.user._id };
    if (status) {
      query.status = status;
    }

    const shares = await CommunityShare.find(query)
      .populate('recipient', 'username firstName lastName')
      .populate('items.product', 'name category imageUrl')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await CommunityShare.countDocuments(query);

    res.json({
      success: true,
      count: shares.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: shares
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.get('/my-reservations', protect, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    let query = { recipient: req.user._id };
    if (status) {
      query.status = status;
    }

    const reservations = await CommunityShare.find(query)
      .populate('donor', 'username firstName lastName')
      .populate('items.product', 'name category imageUrl')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await CommunityShare.countDocuments(query);

    res.json({
      success: true,
      count: reservations.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: reservations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.post('/:id/rate', protect, async (req, res) => {
  try {
    const { rating, feedback } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'La note doit être entre 1 et 5'
      });
    }

    const share = await CommunityShare.findById(req.params.id);

    if (!share) {
      return res.status(404).json({
        success: false,
        message: 'Partage non trouvé'
      });
    }

    if (share.donor.toString() === req.user._id.toString()) {
      share.ratings.recipientRating = rating;
    } else if (share.recipient && share.recipient.toString() === req.user._id.toString()) {
      share.ratings.donorRating = rating;
    } else {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à noter ce partage'
      });
    }

    if (feedback) {
      share.ratings.feedback = feedback;
    }

    await share.save();

    res.json({
      success: true,
      data: share.ratings,
      message: 'Note enregistrée avec succès'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
