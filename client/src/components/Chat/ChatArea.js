import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import socketService from '../../services/socket';
import speechService from '../../services/speechService';
import { fetchMessages } from '../../store/slices/chatSlice';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const ChatArea = ({ currentRoom, messages, user, isConnected }) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const messagesEndRef = useRef(null);
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.chat);

  useEffect(() => {
    if (currentRoom) {
      dispatch(fetchMessages({ roomId: currentRoom._id, page: 1 }));
    }
  }, [currentRoom, dispatch]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!message.trim() || !currentRoom || !isConnected) {
      return;
    }

    const messageData = {
      roomId: currentRoom._id,
      content: message.trim(),
      originalLanguage: user.preferredLanguage || 'en'
    };

    socketService.sendMessage(messageData);
    setMessage('');
  };

  const handleVoiceInput = () => {
    if (!speechService.isSpeechRecognitionAvailable()) {
      alert('Speech recognition is not supported in your browser');
      return;
    }

    if (isRecording) {
      // Stop recording
      speechService.stopSpeechToText();
      setIsRecording(false);
      
      if (transcript.trim()) {
        setMessage(transcript.trim());
        setTranscript('');
      }
    } else {
      // Start recording
      setIsRecording(true);
      setTranscript('');

      speechService.startSpeechToText(
        user.preferredLanguage === 'hi' ? 'hi-IN' : 'en-US',
        (result) => {
          if (result.isFinal) {
            setTranscript(result.final);
          } else {
            setTranscript(result.interim);
          }
        },
        (error) => {
          console.error('Speech recognition error:', error);
          setIsRecording(false);
          setTranscript('');
        }
      );
    }
  };

  if (!currentRoom) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-24 w-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Welcome to Multilingual Chat
          </h3>
          <p className="text-gray-500 mb-4">
            Select a chat room from the sidebar to start messaging
          </p>
          <div className="text-sm text-gray-400">
            <p>🌍 Real-time translation</p>
            <p>🎤 Voice messages</p>
            <p>👥 Group conversations</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Connection Status */}
      {!isConnected && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2">
          <div className="flex items-center space-x-2 text-sm text-yellow-800">
            <div className="h-2 w-2 bg-yellow-400 rounded-full animate-pulse"></div>
            <span>Reconnecting to server...</span>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        {isLoading && messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading messages...</p>
            </div>
          </div>
        ) : (
          <MessageList
            messages={messages}
            currentUser={user}
            currentRoom={currentRoom}
          />
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput
        onSendMessage={handleSendMessage}
        onVoiceInput={handleVoiceInput}
        message={message}
        setMessage={setMessage}
        isRecording={isRecording}
        transcript={transcript}
        isConnected={isConnected}
        user={user}
      />
    </div>
  );
};

export default ChatArea;
