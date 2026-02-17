const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  chatRoom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatRoom',
    required: true
  },
  originalLanguage: {
    type: String,
    required: true,
    default: 'en'
  },
  translations: [{
    language: String,
    text: String,
    translatedAt: {
      type: Date,
      default: Date.now
    }
  }],
  messageType: {
    type: String,
    enum: ['text', 'voice', 'system'],
    default: 'text'
  },
  voiceUrl: {
    type: String,
    default: ''
  },
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: Date,
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    default: null
  }
}, {
  timestamps: true
});

// Index for better performance
messageSchema.index({ chatRoom: 1, createdAt: -1 });
messageSchema.index({ sender: 1 });
messageSchema.index({ 'translations.language': 1 });

// Method to add translation
messageSchema.methods.addTranslation = function(language, text) {
  // Remove existing translation for this language if exists
  this.translations = this.translations.filter(
    translation => translation.language !== language
  );
  
  // Add new translation
  this.translations.push({
    language: language,
    text: text,
    translatedAt: new Date()
  });
};

// Method to get translation for specific language
messageSchema.methods.getTranslation = function(language) {
  const translation = this.translations.find(
    translation => translation.language === language
  );
  return translation ? translation.text : this.content;
};

// Method to mark as read by user
messageSchema.methods.markAsRead = function(userId) {
  if (!this.readBy.some(read => read.user.toString() === userId.toString())) {
    this.readBy.push({
      user: userId,
      readAt: new Date()
    });
  }
};

// Method to get message data for socket emission
messageSchema.methods.toSocketJSON = function() {
  return {
    _id: this._id,
    content: this.content,
    sender: this.sender,
    chatRoom: this.chatRoom,
    originalLanguage: this.originalLanguage,
    translations: this.translations,
    messageType: this.messageType,
    voiceUrl: this.voiceUrl,
    isEdited: this.isEdited,
    editedAt: this.editedAt,
    replyTo: this.replyTo,
    createdAt: this.createdAt,
    readBy: this.readBy
  };
};

module.exports = mongoose.model('Message', messageSchema);
