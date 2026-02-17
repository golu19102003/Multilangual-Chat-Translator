const Message = require('../models/Message');
const ChatRoom = require('../models/ChatRoom');
const User = require('../models/User');
const translationService = require('./translationService');

// Handle socket connection
const handleSocketConnection = (socket, io) => {
  // Join user to their personal room
  socket.join(socket.userId.toString());

  // Update user online status
  updateUserOnlineStatus(socket.userId, true);

  // Handle joining chat room
  socket.on('join-room', async (data) => {
    try {
      const { roomId } = data;
      
      // Verify user is member of the room
      const room = await ChatRoom.findById(roomId).populate('members.user');
      if (!room || !room.isMember(socket.userId)) {
        socket.emit('error', { message: 'Not authorized to join this room' });
        return;
      }

      // Join socket room
      socket.join(roomId);
      socket.currentRoom = roomId;

      // Notify others
      socket.to(roomId).emit('user-joined', {
        user: socket.user.toPublicJSON(),
        timestamp: new Date()
      });

      // Send room info to user
      socket.emit('room-joined', {
        room: room,
        members: room.members.map(m => m.user.toPublicJSON())
      });

      console.log(`👤 ${socket.user.username} joined room ${room.name}`);

    } catch (error) {
      console.error('Join room error:', error);
      socket.emit('error', { message: 'Failed to join room' });
    }
  });

  // Handle leaving chat room
  socket.on('leave-room', async (data) => {
    try {
      const { roomId } = data;
      
      socket.leave(roomId);
      socket.to(roomId).emit('user-left', {
        user: socket.user.toPublicJSON(),
        timestamp: new Date()
      });

      if (socket.currentRoom === roomId) {
        socket.currentRoom = null;
      }

      console.log(`👤 ${socket.user.username} left room ${roomId}`);

    } catch (error) {
      console.error('Leave room error:', error);
    }
  });

  // Handle sending messages
  socket.on('send-message', async (data) => {
    try {
      const { roomId, content, originalLanguage, replyTo } = data;

      // Verify room and membership
      const room = await ChatRoom.findById(roomId);
      if (!room || !room.isMember(socket.userId)) {
        socket.emit('error', { message: 'Not authorized to send messages in this room' });
        return;
      }

      // Create message
      const message = new Message({
        content: content.trim(),
        sender: socket.userId,
        chatRoom: roomId,
        originalLanguage: originalLanguage || 'en',
        replyTo: replyTo || null
      });

      await message.save();
      await message.populate('sender', 'username avatar');

      // Get room members for translation
      const populatedRoom = await ChatRoom.findById(roomId).populate('members.user');
      const members = populatedRoom.members.map(m => m.user);

      // Translate for all members with different preferred languages
      const translations = await translationService.translateForUsers(message, members);

      // Add translations to message
      for (const translation of translations) {
        message.addTranslation(translation.language, translation.text);
      }

      await message.save();

      // Update room last activity
      room.lastActivity = new Date();
      await room.save();

      // Prepare message data for emission
      const messageData = {
        ...message.toSocketJSON(),
        sender: message.sender.toPublicJSON()
      };

      // Emit to all users in room with their preferred translation
      for (const member of members) {
        const translation = message.translations.find(t => t.language === member.preferredLanguage);
        const userTranslation = translation ? translation.text : message.content;
        const personalizedMessage = {
          ...messageData,
          content: userTranslation
        };

        io.to(member._id.toString()).emit('new-message', personalizedMessage);
      }

      console.log(`💬 ${socket.user.username} sent message in room ${room.name}`);

    } catch (error) {
      console.error('Send message error:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Handle typing indicators
  socket.on('typing-start', (data) => {
    const { roomId } = data;
    if (socket.currentRoom === roomId) {
      socket.to(roomId).emit('user-typing', {
        user: socket.user.toPublicJSON(),
        isTyping: true
      });
    }
  });

  socket.on('typing-stop', (data) => {
    const { roomId } = data;
    if (socket.currentRoom === roomId) {
      socket.to(roomId).emit('user-typing', {
        user: socket.user.toPublicJSON(),
        isTyping: false
      });
    }
  });

  // Handle message read status
  socket.on('mark-messages-read', async (data) => {
    try {
      const { roomId, messageIds } = data;

      // Mark messages as read
      await Message.updateMany(
        { 
          _id: { $in: messageIds },
          chatRoom: roomId,
          'readBy.user': { $ne: socket.userId }
        },
        { 
          $push: { 
            readBy: { 
              user: socket.userId, 
              readAt: new Date() 
            } 
          }
        }
      );

      // Notify sender about read status
      const messages = await Message.find({ _id: { $in: messageIds } }).populate('sender');
      for (const message of messages) {
        if (message.sender._id.toString() !== socket.userId.toString()) {
          io.to(message.sender._id.toString()).emit('messages-read', {
            messageId: message._id,
            readBy: socket.user.toPublicJSON(),
            readAt: new Date()
          });
        }
      }

    } catch (error) {
      console.error('Mark messages read error:', error);
    }
  });

  // Handle voice message
  socket.on('voice-message', async (data) => {
    try {
      const { roomId, audioData, originalLanguage } = data;

      // Here you would typically save the audio file to cloud storage
      // For now, we'll create a message with a placeholder URL
      const voiceUrl = `/voice/${Date.now()}.webm`;

      const message = new Message({
        content: '[Voice Message]',
        sender: socket.userId,
        chatRoom: roomId,
        originalLanguage: originalLanguage || 'en',
        messageType: 'voice',
        voiceUrl: voiceUrl
      });

      await message.save();
      await message.populate('sender', 'username avatar');

      // Emit to room
      const messageData = {
        ...message.toSocketJSON(),
        sender: message.sender.toPublicJSON()
      };

      io.to(roomId).emit('new-message', messageData);

      console.log(`🎤 ${socket.user.username} sent voice message in room ${roomId}`);

    } catch (error) {
      console.error('Voice message error:', error);
      socket.emit('error', { message: 'Failed to send voice message' });
    }
  });

  // Handle disconnection
  socket.on('disconnect', async () => {
    try {
      // Update user offline status
      await updateUserOnlineStatus(socket.userId, false);

      // Leave current room
      if (socket.currentRoom) {
        socket.to(socket.currentRoom).emit('user-left', {
          user: socket.user.toPublicJSON(),
          timestamp: new Date()
        });
      }

      console.log(`🔌 ${socket.user.username} disconnected`);

    } catch (error) {
      console.error('Disconnect error:', error);
    }
  });
};

// Update user online status
const updateUserOnlineStatus = async (userId, isOnline) => {
  try {
    await User.findByIdAndUpdate(userId, {
      isOnline: isOnline,
      lastSeen: new Date()
    });
  } catch (error) {
    console.error('Update online status error:', error);
  }
};

module.exports = {
  handleSocketConnection,
  updateUserOnlineStatus
};
