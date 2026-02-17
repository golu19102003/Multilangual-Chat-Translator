const admin = require('firebase-admin');
const User = require('../models/User');

// Initialize Firebase Admin SDK
const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
};

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('✅ Firebase Admin SDK initialized successfully');
  } catch (error) {
    console.error('❌ Firebase Admin SDK initialization failed:', error);
  }
}

// Authentication middleware for HTTP routes
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }

    // Verify Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Get or create user in our database
    let user = await User.findOne({ _id: decodedToken.uid });
    
    if (!user) {
      // Create new user if doesn't exist
      user = new User({
        _id: decodedToken.uid,
        username: decodedToken.name || decodedToken.email?.split('@')[0] || 'User',
        email: decodedToken.email,
        preferredLanguage: 'en',
        avatar: decodedToken.picture || '',
        isOnline: false,
        lastSeen: new Date(),
        speechEnabled: true
      });
      await user.save();
    } else {
      // Update user info if needed
      if (decodedToken.name && user.username !== decodedToken.name) {
        user.username = decodedToken.name;
      }
      if (decodedToken.picture && user.avatar !== decodedToken.picture) {
        user.avatar = decodedToken.picture;
      }
      await user.save();
    }
    
    req.userId = user._id;
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired.' 
      });
    }
    
    if (error.code === 'auth/id-token-revoked') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token revoked.' 
      });
    }
    
    if (error.code === 'auth/invalid-id-token') {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token.' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Server error in authentication.' 
    });
  }
};

// Authentication middleware for Socket.io
const authenticateSocket = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    // Verify Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Get or create user in our database
    let user = await User.findOne({ _id: decodedToken.uid });
    
    if (!user) {
      // Create new user if doesn't exist
      user = new User({
        _id: decodedToken.uid,
        username: decodedToken.name || decodedToken.email?.split('@')[0] || 'User',
        email: decodedToken.email,
        preferredLanguage: 'en',
        avatar: decodedToken.picture || '',
        isOnline: false,
        lastSeen: new Date(),
        speechEnabled: true
      });
      await user.save();
    }
    
    socket.userId = user._id;
    socket.user = user;
    next();
  } catch (error) {
    console.error('Socket authentication error:', error);
    next(new Error('Authentication error: Invalid token'));
  }
};

// Get Firebase Auth instance
const getAuth = () => {
  return admin.auth();
};

module.exports = {
  authMiddleware,
  authenticateSocket,
  getAuth,
  admin
};
