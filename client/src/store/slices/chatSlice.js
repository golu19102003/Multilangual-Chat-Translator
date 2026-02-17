import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { chatAPI } from '../../services/api';

// Async thunks
export const fetchRooms = createAsyncThunk(
  'chat/fetchRooms',
  async (_, { rejectWithValue }) => {
    try {
      const response = await chatAPI.getRooms();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch rooms');
    }
  }
);

export const createRoom = createAsyncThunk(
  'chat/createRoom',
  async (roomData, { rejectWithValue }) => {
    try {
      const response = await chatAPI.createRoom(roomData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create room');
    }
  }
);

export const fetchRoomDetails = createAsyncThunk(
  'chat/fetchRoomDetails',
  async (roomId, { rejectWithValue }) => {
    try {
      const response = await chatAPI.getRoom(roomId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch room details');
    }
  }
);

export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async ({ roomId, page = 1, limit = 50 }, { rejectWithValue }) => {
    try {
      const response = await chatAPI.getMessages(roomId, page, limit);
      return { ...response, roomId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch messages');
    }
  }
);

export const joinRoom = createAsyncThunk(
  'chat/joinRoom',
  async (roomId, { rejectWithValue }) => {
    try {
      const response = await chatAPI.joinRoom(roomId);
      return { ...response, roomId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to join room');
    }
  }
);

export const leaveRoom = createAsyncThunk(
  'chat/leaveRoom',
  async (roomId, { rejectWithValue }) => {
    try {
      const response = await chatAPI.leaveRoom(roomId);
      return { ...response, roomId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to leave room');
    }
  }
);

const initialState = {
  rooms: [],
  currentRoom: null,
  messages: [],
  onlineUsers: [],
  typingUsers: [],
  isLoading: false,
  error: null,
  isConnected: false,
  pagination: {
    page: 1,
    limit: 50,
    total: 0,
    pages: 0,
  },
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentRoom: (state, action) => {
      state.currentRoom = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.unshift(action.payload);
    },
    addMessages: (state, action) => {
      state.messages = [...action.payload, ...state.messages];
    },
    updateMessage: (state, action) => {
      const index = state.messages.findIndex(msg => msg._id === action.payload._id);
      if (index !== -1) {
        state.messages[index] = action.payload;
      }
    },
    removeMessage: (state, action) => {
      state.messages = state.messages.filter(msg => msg._id !== action.payload);
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    addOnlineUser: (state, action) => {
      if (!state.onlineUsers.find(user => user._id === action.payload._id)) {
        state.onlineUsers.push(action.payload);
      }
    },
    removeOnlineUser: (state, action) => {
      state.onlineUsers = state.onlineUsers.filter(user => user._id !== action.payload);
    },
    setTypingUsers: (state, action) => {
      const { user, isTyping } = action.payload;
      if (isTyping) {
        if (!state.typingUsers.find(typingUser => typingUser._id === user._id)) {
          state.typingUsers.push(user);
        }
      } else {
        state.typingUsers = state.typingUsers.filter(typingUser => typingUser._id !== user._id);
      }
    },
    setConnectionStatus: (state, action) => {
      state.isConnected = action.payload;
    },
    clearMessages: (state) => {
      state.messages = [];
      state.pagination = {
        page: 1,
        limit: 50,
        total: 0,
        pages: 0,
      };
    },
    updateRoomLastActivity: (state, action) => {
      const { roomId, lastActivity } = action.payload;
      const room = state.rooms.find(r => r._id === roomId);
      if (room) {
        room.lastActivity = lastActivity;
      }
      if (state.currentRoom && state.currentRoom._id === roomId) {
        state.currentRoom.lastActivity = lastActivity;
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch rooms
    builder
      .addCase(fetchRooms.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.isLoading = false;
        state.rooms = action.payload.rooms;
        state.error = null;
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Create room
    builder
      .addCase(createRoom.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createRoom.fulfilled, (state, action) => {
        state.isLoading = false;
        state.rooms.unshift(action.payload.room);
        state.error = null;
      })
      .addCase(createRoom.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Fetch room details
    builder
      .addCase(fetchRoomDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRoomDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentRoom = action.payload.room;
        state.error = null;
      })
      .addCase(fetchRoomDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Fetch messages
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        const { messages, pagination } = action.payload;
        if (pagination.page === 1) {
          state.messages = messages;
        } else {
          state.messages = [...messages, ...state.messages];
        }
        state.pagination = pagination;
        state.error = null;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Join room
    builder
      .addCase(joinRoom.fulfilled, (state, action) => {
        const { room, roomId } = action.payload;
        const existingRoom = state.rooms.find(r => r._id === roomId);
        if (!existingRoom) {
          state.rooms.unshift(room);
        }
        if (state.currentRoom && state.currentRoom._id === roomId) {
          state.currentRoom = room;
        }
      });

    // Leave room
    builder
      .addCase(leaveRoom.fulfilled, (state, action) => {
        const { roomId } = action.payload;
        state.rooms = state.rooms.filter(room => room._id !== roomId);
        if (state.currentRoom && state.currentRoom._id === roomId) {
          state.currentRoom = null;
          state.messages = [];
        }
      });
  },
});

export const {
  clearError,
  setCurrentRoom,
  addMessage,
  addMessages,
  updateMessage,
  removeMessage,
  setOnlineUsers,
  addOnlineUser,
  removeOnlineUser,
  setTypingUsers,
  setConnectionStatus,
  clearMessages,
  updateRoomLastActivity,
} = chatSlice.actions;

export default chatSlice.reducer;
