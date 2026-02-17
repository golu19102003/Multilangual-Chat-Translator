import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchRooms, 
  setCurrentRoom, 
  addMessage, 
  setTypingUsers, 
  setOnlineUsers 
} from '../../store/slices/chatSlice';
import socketService from '../../services/socket';

// Components
import Sidebar from '../Chat/Sidebar';
import ChatArea from '../Chat/ChatArea';
import Header from '../Chat/Header';
import LoadingSpinner from '../UI/LoadingSpinner';

const ChatLayout = () => {
  const dispatch = useDispatch();
  const { roomId } = useParams();
  const { 
    rooms, 
    currentRoom, 
    messages, 
    isLoading, 
    isConnected,
    onlineUsers 
  } = useSelector((state) => state.chat);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    // Fetch rooms on component mount
    dispatch(fetchRooms());
  }, [dispatch]);

  useEffect(() => {
    if (isConnected) {
      // Set up socket event listeners
      socketService.on('new-message', (message) => {
        dispatch(addMessage(message));
      });

      socketService.on('user-typing', (data) => {
        dispatch(setTypingUsers(data));
      });

      socketService.on('user-joined', (data) => {
        dispatch(setOnlineUsers([...onlineUsers, data.user]));
      });

      socketService.on('user-left', (data) => {
        dispatch(setOnlineUsers(onlineUsers.filter(u => u._id !== data.user._id)));
      });

      // Cleanup
      return () => {
        socketService.off('new-message');
        socketService.off('user-typing');
        socketService.off('user-joined');
        socketService.off('user-left');
      };
    }
  }, [isConnected, dispatch, onlineUsers]);

  useEffect(() => {
    // Handle room selection from URL
    if (roomId && rooms.length > 0) {
      const room = rooms.find(r => r._id === roomId);
      if (room) {
        dispatch(setCurrentRoom(room));
        socketService.joinRoom(roomId);
      }
    }
  }, [roomId, rooms, dispatch]);

  const handleRoomSelect = (room) => {
    // Leave current room if any
    if (currentRoom) {
      socketService.leaveRoom(currentRoom._id);
    }
    
    // Join new room
    dispatch(setCurrentRoom(room));
    socketService.joinRoom(room._id);
  };

  if (isLoading && rooms.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" text="Loading chat rooms..." />
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 bg-white border-r border-gray-200 overflow-hidden`}>
        <Sidebar
          rooms={rooms}
          currentRoom={currentRoom}
          onRoomSelect={handleRoomSelect}
          onlineUsers={onlineUsers}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <Header
          currentRoom={currentRoom}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />
        
        <ChatArea
          currentRoom={currentRoom}
          messages={messages}
          isConnected={isConnected}
        />
      </div>
    </div>
  );
};

export default ChatLayout;
