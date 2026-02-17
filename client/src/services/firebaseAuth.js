import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

class FirebaseAuthService {
  // Sign up with email and password
  async signUp(email, password, username, preferredLanguage = 'en') {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update user profile with display name
      await updateProfile(user, {
        displayName: username
      });

      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        username: username,
        email: email,
        preferredLanguage: preferredLanguage,
        avatar: '',
        isOnline: false,
        lastSeen: new Date(),
        speechEnabled: true,
        createdAt: new Date()
      });

      // Get ID token for backend
      const idToken = await user.getIdToken();

      return {
        user: {
          _id: user.uid,
          username: username,
          email: email,
          preferredLanguage: preferredLanguage,
          avatar: '',
          isOnline: false,
          lastSeen: new Date().toISOString(),
          speechEnabled: true
        },
        token: idToken
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Sign in with email and password
  async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();

      // Get ID token for backend
      const idToken = await user.getIdToken();

      return {
        user: {
          _id: user.uid,
          username: userData?.username || user.displayName || 'User',
          email: user.email,
          preferredLanguage: userData?.preferredLanguage || 'en',
          avatar: userData?.avatar || '',
          isOnline: userData?.isOnline || false,
          lastSeen: userData?.lastSeen || new Date().toISOString(),
          speechEnabled: userData?.speechEnabled !== false
        },
        token: idToken
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Sign in with Google
  async signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        // Create new user document
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          username: user.displayName || 'Google User',
          email: user.email,
          preferredLanguage: 'en',
          avatar: user.photoURL || '',
          isOnline: false,
          lastSeen: new Date(),
          speechEnabled: true,
          createdAt: new Date()
        });
      }

      // Get user data
      const userData = (await getDoc(doc(db, 'users', user.uid))).data();

      // Get ID token for backend
      const idToken = await user.getIdToken();

      return {
        user: {
          _id: user.uid,
          username: userData?.username || user.displayName || 'Google User',
          email: user.email,
          preferredLanguage: userData?.preferredLanguage || 'en',
          avatar: userData?.avatar || user.photoURL || '',
          isOnline: userData?.isOnline || false,
          lastSeen: userData?.lastSeen || new Date().toISOString(),
          speechEnabled: userData?.speechEnabled !== false
        },
        token: idToken
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Sign out
  async signOut() {
    try {
      await signOut(auth);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get current user
  getCurrentUser() {
    return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        unsubscribe();
        
        if (user) {
          try {
            // Get user data from Firestore
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            const userData = userDoc.data();

            // Get ID token for backend
            const idToken = await user.getIdToken();

            resolve({
              user: {
                _id: user.uid,
                username: userData?.username || user.displayName || 'User',
                email: user.email,
                preferredLanguage: userData?.preferredLanguage || 'en',
                avatar: userData?.avatar || '',
                isOnline: userData?.isOnline || false,
                lastSeen: userData?.lastSeen || new Date().toISOString(),
                speechEnabled: userData?.speechEnabled !== false
              },
              token: idToken
            });
          } catch (error) {
            reject(error);
          }
        } else {
          resolve(null);
        }
      }, reject);
    });
  }

  // Update user profile
  async updateProfile(updates) {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No user is currently signed in');
      }

      // Update Firebase Auth profile if username is provided
      if (updates.username) {
        await updateProfile(user, {
          displayName: updates.username
        });
      }

      // Update Firestore document
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, updates, { merge: true });

      // Get updated user data
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();

      return {
        user: {
          _id: user.uid,
          username: userData?.username || user.displayName || 'User',
          email: user.email,
          preferredLanguage: userData?.preferredLanguage || 'en',
          avatar: userData?.avatar || '',
          isOnline: userData?.isOnline || false,
          lastSeen: userData?.lastSeen || new Date().toISOString(),
          speechEnabled: userData?.speechEnabled !== false
        }
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Reset password
  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Handle Firebase errors
  handleError(error) {
    let message = 'An error occurred during authentication';
    
    switch (error.code) {
      case 'auth/email-already-in-use':
        message = 'This email is already registered';
        break;
      case 'auth/invalid-email':
        message = 'Invalid email address';
        break;
      case 'auth/weak-password':
        message = 'Password should be at least 6 characters';
        break;
      case 'auth/user-not-found':
        message = 'User not found';
        break;
      case 'auth/wrong-password':
        message = 'Incorrect password';
        break;
      case 'auth/too-many-requests':
        message = 'Too many attempts. Please try again later';
        break;
      case 'auth/network-request-failed':
        message = 'Network error. Please check your connection';
        break;
      default:
        message = error.message || message;
    }
    
    return new Error(message);
  }

  // Listen to auth state changes
  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, callback);
  }
}

export default new FirebaseAuthService();
