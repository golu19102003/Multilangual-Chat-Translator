import React from 'react';
import { formatDistanceToNow } from 'date-fns';

const MessageList = ({ messages, currentUser, currentRoom }) => {
  const formatMessageTime = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return 'Just now';
    }
  };

  const isOwnMessage = (message) => {
    return message.sender?._id === currentUser?._id;
  };

  const groupMessagesByDate = (messages) => {
    const groups = {};
    
    messages.forEach(message => {
      const date = new Date(message.createdAt).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center py-8">
          <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No messages yet
          </h3>
          <p className="text-gray-500">
            Be the first to say something in this room!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {Object.entries(messageGroups).map(([date, dateMessages]) => (
        <div key={date}>
          {/* Date Separator */}
          <div className="flex items-center justify-center my-4">
            <div className="bg-gray-200 rounded-full px-3 py-1">
              <span className="text-xs text-gray-600 font-medium">
                {date === new Date().toDateString() ? 'Today' : 
                 date === new Date(Date.now() - 86400000).toDateString() ? 'Yesterday' : 
                 new Date(date).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Messages for this date */}
          <div className="space-y-3">
            {dateMessages.map((message, index) => {
              const own = isOwnMessage(message);
              const showAvatar = !own && (index === 0 || 
                dateMessages[index - 1].sender?._id !== message.sender?._id);
              
              return (
                <div
                  key={message._id}
                  className={`flex ${own ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${own ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    {/* Avatar */}
                    {showAvatar && (
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-medium">
                          {message.sender?.username?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div className={`flex flex-col ${own ? 'items-end' : 'items-start'}`}>
                      {!own && showAvatar && (
                        <span className="text-xs text-gray-500 mb-1 ml-1">
                          {message.sender?.username}
                        </span>
                      )}
                      
                      <div
                        className={`message-bubble ${
                          own ? 'message-sent' : 'message-received'
                        } ${message.messageType === 'voice' ? 'flex items-center space-x-2' : ''}`}
                      >
                        {message.messageType === 'voice' ? (
                          <>
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm">Voice Message</span>
                          </>
                        ) : (
                          <p className="text-sm break-words">
                            {message.content}
                          </p>
                        )}
                      </div>

                      {/* Translation Info */}
                      {message.originalLanguage !== currentUser.preferredLanguage && (
                        <div className="text-xs text-blue-600 mt-1">
                          Translated from {message.originalLanguage?.toUpperCase()}
                        </div>
                      )}

                      {/* Message Info */}
                      <div className={`flex items-center space-x-2 mt-1 text-xs text-gray-500 ${own ? 'justify-end' : ''}`}>
                        <span>{formatMessageTime(message.createdAt)}</span>

                        {/* Read indicator for own messages */}
                        {own && message.readBy?.length > 1 && (
                          <>
                            <span>•</span>
                            <span className="text-green-600">
                              Read by {message.readBy.length - 1}
                            </span>
                          </>
                        )}

                        {/* Edited indicator */}
                        {message.isEdited && (
                          <>
                            <span>•</span>
                            <span>Edited</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
