import React, { useState } from 'react';
import { PlusIcon, MagnifyingGlassIcon, UserGroupIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { useDispatch } from 'react-redux';
import { setCreateRoomModalOpen } from '../../store/slices/uiSlice';

const Sidebar = ({ rooms, currentRoom, onRoomSelect, onlineUsers }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateRoom = () => {
    dispatch(setCreateRoomModalOpen(true));
  };

  return (
    <div className="h-full flex flex-col">
      {/* User Profile */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="h-10 w-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-medium">
              Guest
            </div>
            <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-400 rounded-full border-2 border-white"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              Guest User
            </p>
            <p className="text-xs text-gray-500 truncate">
              Enjoying the chat experience
            </p>
          </div>
        </div>
      </div>

      {/* Online Users */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <UserGroupIcon className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium text-gray-700">
              Online ({onlineUsers.length})
            </span>
          </div>
        </div>
        <div className="flex -space-x-2">
          {onlineUsers.slice(0, 5).map((onlineUser, index) => (
            <div
              key={onlineUser._id}
              className="h-6 w-6 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs font-medium border-2 border-white"
              title={onlineUser.username}
            >
              {onlineUser.username?.charAt(0)?.toUpperCase()}
            </div>
          ))}
          {onlineUsers.length > 5 && (
            <div className="h-6 w-6 rounded-full bg-gray-500 flex items-center justify-center text-white text-xs font-medium border-2 border-white">
              +{onlineUsers.length - 5}
            </div>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search rooms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Create Room Button */}
      <div className="px-4 pb-2">
        <button
          onClick={handleCreateRoom}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <PlusIcon className="h-4 w-4" />
          <span className="text-sm font-medium">Create Room</span>
        </button>
      </div>

      {/* Rooms List */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Chat Rooms
        </h3>
        <div className="space-y-1">
          {filteredRooms.length === 0 ? (
            <div className="text-center py-8">
              <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">
                {searchQuery ? 'No rooms found' : 'No rooms yet'}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Create your first room to get started
              </p>
            </div>
          ) : (
            filteredRooms.map((room) => (
              <div
                key={room._id}
                onClick={() => onRoomSelect(room)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  currentRoom?._id === room._id
                    ? 'bg-primary-50 border border-primary-200'
                    : 'hover:bg-gray-50 border border-transparent'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                        <ChatBubbleLeftRightIcon className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {room.name}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>{room.members?.length || 0} members</span>
                        {room.isPrivate && (
                          <span className="text-gray-400">• Private</span>
                        )}
                      </div>
                    </div>
                  </div>
                  {room.lastActivity && (
                    <div className="text-xs text-gray-400">
                      {new Date(room.lastActivity).toLocaleDateString()}
                    </div>
                  )}
                </div>
                {room.description && (
                  <p className="mt-1 text-xs text-gray-500 truncate">
                    {room.description}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
