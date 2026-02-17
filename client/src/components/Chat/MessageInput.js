import React, { useState, useRef } from 'react';
import { PaperAirplaneIcon, MicrophoneIcon } from '@heroicons/react/24/outline';
import speechService from '../../services/speechService';

const MessageInput = ({ 
  onSendMessage, 
  onVoiceInput, 
  message, 
  setMessage, 
  isRecording, 
  transcript, 
  isConnected, 
  user 
}) => {
  const textareaRef = useRef(null);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage(e);
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white">
      {/* Voice Recording Indicator */}
      {isRecording && (
        <div className="px-4 py-2 bg-red-50 border-b border-red-200">
          <div className="flex items-center space-x-2 text-sm text-red-600">
            <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse"></div>
            <span>Recording... {transcript || 'Speak now'}</span>
            <button
              onClick={onVoiceInput}
              className="ml-auto text-red-600 hover:text-red-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <form onSubmit={onSendMessage} className="p-4">
        <div className="flex items-end space-x-2">
          {/* Voice Input Button */}
          <button
            type="button"
            onClick={onVoiceInput}
            disabled={!isConnected}
            className={`p-2 rounded-full transition-colors ${
              isRecording
                ? 'bg-red-500 text-white animate-pulse'
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
            } ${!isConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={isRecording ? 'Stop recording' : 'Start voice input'}
          >
            <MicrophoneIcon className="h-5 w-5" />
          </button>

          {/* Message Input */}
          <div className="flex-1">
            <textarea
              ref={textareaRef}
              value={isRecording ? transcript : message}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder={isRecording ? 'Speaking...' : 'Type a message...'}
              disabled={!isConnected || isRecording}
              rows={1}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                minHeight: '40px',
                maxHeight: '120px',
                height: 'auto'
              }}
            />
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!message.trim() || !isConnected || isRecording}
            className="p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Send message"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Translation Indicator */}
        <div className="mt-2 text-xs text-gray-500 text-center">
          Messages will be automatically translated to each user's preferred language
        </div>
      </form>
    </div>
  );
};

export default MessageInput;
