import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: 'light',
  sidebarOpen: true,
  languageSelectorOpen: false,
  createRoomModalOpen: false,
  settingsModalOpen: false,
  userProfileModalOpen: false,
  notifications: [],
  soundEnabled: true,
  speechEnabled: true,
  autoTranslate: true,
  showTimestamps: true,
  showAvatars: true,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    toggleLanguageSelector: (state) => {
      state.languageSelectorOpen = !state.languageSelectorOpen;
    },
    setLanguageSelectorOpen: (state, action) => {
      state.languageSelectorOpen = action.payload;
    },
    toggleCreateRoomModal: (state) => {
      state.createRoomModalOpen = !state.createRoomModalOpen;
    },
    setCreateRoomModalOpen: (state, action) => {
      state.createRoomModalOpen = action.payload;
    },
    toggleSettingsModal: (state) => {
      state.settingsModalOpen = !state.settingsModalOpen;
    },
    setSettingsModalOpen: (state, action) => {
      state.settingsModalOpen = action.payload;
    },
    toggleUserProfileModal: (state) => {
      state.userProfileModalOpen = !state.userProfileModalOpen;
    },
    setUserProfileModalOpen: (state, action) => {
      state.userProfileModalOpen = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications.unshift({
        id: Date.now(),
        ...action.payload,
        timestamp: new Date().toISOString(),
      });
      // Keep only last 50 notifications
      if (state.notifications.length > 50) {
        state.notifications = state.notifications.slice(0, 50);
      }
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    toggleSound: (state) => {
      state.soundEnabled = !state.soundEnabled;
    },
    setSoundEnabled: (state, action) => {
      state.soundEnabled = action.payload;
    },
    toggleSpeech: (state) => {
      state.speechEnabled = !state.speechEnabled;
    },
    setSpeechEnabled: (state, action) => {
      state.speechEnabled = action.payload;
    },
    toggleAutoTranslate: (state) => {
      state.autoTranslate = !state.autoTranslate;
    },
    setAutoTranslate: (state, action) => {
      state.autoTranslate = action.payload;
    },
    toggleTimestamps: (state) => {
      state.showTimestamps = !state.showTimestamps;
    },
    setShowTimestamps: (state, action) => {
      state.showTimestamps = action.payload;
    },
    toggleAvatars: (state) => {
      state.showAvatars = !state.showAvatars;
    },
    setShowAvatars: (state, action) => {
      state.showAvatars = action.payload;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleLanguageSelector,
  setLanguageSelectorOpen,
  toggleCreateRoomModal,
  setCreateRoomModalOpen,
  toggleSettingsModal,
  setSettingsModalOpen,
  toggleUserProfileModal,
  setUserProfileModalOpen,
  addNotification,
  removeNotification,
  clearNotifications,
  toggleSound,
  setSoundEnabled,
  toggleSpeech,
  setSpeechEnabled,
  toggleAutoTranslate,
  setAutoTranslate,
  toggleTimestamps,
  setShowTimestamps,
  toggleAvatars,
  setShowAvatars,
  setTheme,
} = uiSlice.actions;

export default uiSlice.reducer;
