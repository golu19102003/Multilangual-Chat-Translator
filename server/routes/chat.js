const express = require('express');
const ChatRoom = require('../models/ChatRoom');
const Message = require('../models/Message');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get all chat rooms for user
router.get('/rooms', authMiddleware, async (req, res) => {
  try {
    const rooms = await ChatRoom.find({
      'members.user': req.userId,
      isActive: true
    })
    .populate('admin', 'username avatar')
    .populate('members.user', 'username avatar isOnline lastSeen')
    .sort({ lastActivity: -1 });

    res.json({
      success: true,
      rooms
    });

  } catch (error) {
    console.error('Get rooms error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching rooms' 
    });
  }
});

// Create new chat room
router.post('/rooms', authMiddleware, async (req, res) => {
  try {
    const { name, description, isPrivate, maxMembers } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Room name is required' 
      });
    }

    const room = new ChatRoom({
      name: name.trim(),
      description: description?.trim() || '',
      isPrivate: isPrivate || false,
      maxMembers: maxMembers || 100,
      admin: req.userId,
      members: [{
        user: req.userId,
        role: 'admin'
      }]
    });

    await room.save();
    await room.populate('admin', 'username avatar');
    await room.populate('members.user', 'username avatar isOnline lastSeen');

    res.status(201).json({
      success: true,
      message: 'Chat room created successfully',
      room
    });

  } catch (error) {
    console.error('Create room error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while creating room' 
    });
  }
});

// Get specific chat room details
router.get('/rooms/:roomId', authMiddleware, async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await ChatRoom.findById(roomId)
      .populate('admin', 'username avatar')
      .populate('members.user', 'username avatar isOnline lastSeen preferredLanguage');

    if (!room) {
      return res.status(404).json({ 
        success: false, 
        message: 'Chat room not found' 
      });
    }

    // Check if user is member
    if (!room.isMember(req.userId)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to access this room' 
      });
    }

    res.json({
      success: true,
      room
    });

  } catch (error) {
    console.error('Get room error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching room' 
    });
  }
});

// Join chat room
router.post('/rooms/:roomId/join', authMiddleware, async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await ChatRoom.findById(roomId);
    if (!room) {
      return res.status(404).json({ 
        success: false, 
        message: 'Chat room not found' 
      });
    }

    // Check if room is private
    if (room.isPrivate) {
      return res.status(403).json({ 
        success: false, 
        message: 'Cannot join private room' 
      });
    }

    // Check if room is full
    if (room.getMemberCount() >= room.maxMembers) {
      return res.status(400).json({ 
        success: false, 
        message: 'Room is full' 
      });
    }

    // Add user to room
    room.addMember(req.userId, 'member');
    await room.save();
    await room.populate('members.user', 'username avatar isOnline lastSeen');

    res.json({
      success: true,
      message: 'Joined room successfully',
      room
    });

  } catch (error) {
    console.error('Join room error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while joining room' 
    });
  }
});

// Leave chat room
router.post('/rooms/:roomId/leave', authMiddleware, async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await ChatRoom.findById(roomId);
    if (!room) {
      return res.status(404).json({ 
        success: false, 
        message: 'Chat room not found' 
      });
    }

    // Check if user is member
    if (!room.isMember(req.userId)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not a member of this room' 
      });
    }

    // Don't allow admin to leave if they are the only member
    if (room.admin.toString() === req.userId.toString() && room.getMemberCount() === 1) {
      return res.status(400).json({ 
        success: false, 
        message: 'Admin cannot leave room as the only member' 
      });
    }

    // Remove user from room
    room.removeMember(req.userId);
    await room.save();

    res.json({
      success: true,
      message: 'Left room successfully'
    });

  } catch (error) {
    console.error('Leave room error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while leaving room' 
    });
  }
});

// Get messages for a room
router.get('/rooms/:roomId/messages', authMiddleware, async (req, res) => {
  try {
    const { roomId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    // Verify room access
    const room = await ChatRoom.findById(roomId);
    if (!room || !room.isMember(req.userId)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to access messages in this room' 
      });
    }

    const messages = await Message.find({ chatRoom: roomId })
      .populate('sender', 'username avatar')
      .populate('replyTo', 'content sender')
      .populate('readBy.user', 'username')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Message.countDocuments({ chatRoom: roomId });

    res.json({
      success: true,
      messages: messages.reverse(), // Reverse to show oldest first
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching messages' 
    });
  }
});

// Delete message
router.delete('/messages/:messageId', authMiddleware, async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ 
        success: false, 
        message: 'Message not found' 
      });
    }

    // Check if user is sender or room admin
    const room = await ChatRoom.findById(message.chatRoom);
    if (message.sender.toString() !== req.userId.toString() && 
        room.admin.toString() !== req.userId.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to delete this message' 
      });
    }

    await Message.findByIdAndDelete(messageId);

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });

  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while deleting message' 
    });
  }
});

module.exports = router;
