import io from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
  }

  connect(token) {
    if (this.socket && this.connected) {
      return this.socket;
    }

    this.socket = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:5000', {
      auth: {
        token: token
      }
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.connected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
      this.connected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      this.connected = false;
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  joinRoom(roomId) {
    if (this.socket && this.connected) {
      this.socket.emit('join-room', { roomId });
    }
  }

  leaveRoom(roomId) {
    if (this.socket && this.connected) {
      this.socket.emit('leave-room', { roomId });
    }
  }

  sendMessage(data) {
    if (this.socket && this.connected) {
      this.socket.emit('send-message', data);
    }
  }

  startTyping(roomId) {
    if (this.socket && this.connected) {
      this.socket.emit('typing-start', { roomId });
    }
  }

  stopTyping(roomId) {
    if (this.socket && this.connected) {
      this.socket.emit('typing-stop', { roomId });
    }
  }

  markMessagesRead(roomId, messageIds) {
    if (this.socket && this.connected) {
      this.socket.emit('mark-messages-read', { roomId, messageIds });
    }
  }

  sendVoiceMessage(data) {
    if (this.socket && this.connected) {
      this.socket.emit('voice-message', data);
    }
  }

  // Event listeners
  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  isConnected() {
    return this.connected;
  }
}

export default new SocketService();
