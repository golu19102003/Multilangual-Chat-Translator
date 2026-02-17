const express = require('express');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Search users
router.get('/search', authMiddleware, async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Search query is required' 
      });
    }

    const users = await User.find({
      $and: [
        { _id: { $ne: req.userId } }, // Exclude current user
        {
          $or: [
            { username: { $regex: q, $options: 'i' } },
            { email: { $regex: q, $options: 'i' } }
          ]
        }
      ]
    })
    .select('username email avatar isOnline lastSeen preferredLanguage')
    .limit(parseInt(limit));

    res.json({
      success: true,
      users
    });

  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while searching users' 
    });
  }
});

// Get online users
router.get('/online', authMiddleware, async (req, res) => {
  try {
    const users = await User.find({
      _id: { $ne: req.userId },
      isOnline: true
    })
    .select('username avatar lastSeen preferredLanguage')
    .sort({ lastSeen: -1 });

    res.json({
      success: true,
      users
    });

  } catch (error) {
    console.error('Get online users error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching online users' 
    });
  }
});

// Get user profile
router.get('/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .select('username email avatar isOnline lastSeen preferredLanguage createdAt');

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching user profile' 
    });
  }
});

// Update user settings
router.put('/settings', authMiddleware, async (req, res) => {
  try {
    const { preferredLanguage, speechEnabled, notifications } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Update settings
    if (preferredLanguage) user.preferredLanguage = preferredLanguage;
    if (typeof speechEnabled === 'boolean') user.speechEnabled = speechEnabled;
    
    await user.save();

    res.json({
      success: true,
      message: 'Settings updated successfully',
      settings: {
        preferredLanguage: user.preferredLanguage,
        speechEnabled: user.speechEnabled
      }
    });

  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while updating settings' 
    });
  }
});

module.exports = router;
