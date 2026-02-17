# Real-Time Multilingual Chat Translator

A powerful real-time chat application that breaks language barriers by automatically translating messages between users speaking different languages. Built with modern web technologies and featuring voice accessibility for inclusive communication.

## �️ GitHub Topics & Keywords

### 🌟 Primary Topics
`react` `nodejs` `multilingual` `translation` `realtime` `chat` `socketio` `mongodb` `firebase` `redux` `tailwindcss`

### 🚀 Advanced Features Topics
`voice-recognition` `text-to-speech` `ai-translation` `language-detection` `accessibility` `web-speech-api` `realtime-translation` `cross-platform`

### 🛠 Technology Stack Topics
`react-19` `expressjs` `redux-toolkit` `tailwindcss-3` `mongodb` `jwt-authentication` `websocket` `firebase-auth` `axios` `nodemon`

### 🌍 Language & Translation Topics
`google-translate` `language-translator` `multilingual-chat` `internationalization` `i18n` `localization` `translation-api` `language-support` `100-languages`

### 🎨 UI/UX Topics
`responsive-design` `dark-mode` `modern-ui` `user-experience` `accessibility` `mobile-friendly` `progressive-web-app` `material-design`

### 🔧 Development Topics
`fullstack` `mern-stack` `javascript` `es6` `async-await` `rest-api` `real-time-communication` `web-development` `frontend` `backend`

### 📱 Application Type Topics
`chat-application` `messaging-app` `social-platform` `communication-tool` `translation-service` `language-learning` `educational-tool` `business-tool`

### 🎯 Use Case Topics
`language-learning` `international-communication` `business-communication` `educational-platform` `accessibility-tool` `travel-app` `social-networking` `team-collaboration`

## �🌟 Features

- **Real-Time Messaging**: Instant message delivery using Socket.io
- **Automatic Translation**: Messages translated to each user's preferred language
- **Voice Support**: Speech-to-text and text-to-speech capabilities
- **Multi-Language Support**: 20+ languages including Hindi, Bengali, Tamil, Telugu, and more
- **Chat Rooms**: Create and join group conversations
- **User Authentication**: Secure JWT-based authentication
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Online Status**: See who's online and typing indicators
- **Message History**: Persistent chat storage with MongoDB

## 🛠 Technology Stack

### Frontend
- **React.js** - User interface framework
- **Redux Toolkit** - State management
- **Socket.io Client** - Real-time communication
- **TailwindCSS** - Styling framework
- **Web Speech API** - Voice recognition and synthesis

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Socket.io** - Real-time communication server
- **MongoDB** - Database
- **JWT** - Authentication
- **Google Translate API** - Translation service

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd multilingual-chat-translator
```

2. **Install dependencies**
```bash
# Install server dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

📝 **Note**: `node_modules` is intentionally excluded from Git (.gitignore) because:
- Large file sizes (GBs of data)
- Security best practices
- Can be regenerated with `npm install`
- Platform-specific dependencies

3. **Set up environment variables**

**Server (.env)**
```bash
cp .env.example .env
# Edit .env with your configuration
```

**Client (.env)**
```bash
cd client
cp .env.example .env
# Edit .env with your configuration
cd ..
```

4. **Start MongoDB**
```bash
# If using local MongoDB
mongod
```

5. **Run the application**
```bash
# Start both server and client
npm run dev

# Or start individually
npm run server  # Backend server on port 5000
npm run client  # Frontend on port 3000
```

6. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## 📱 Usage

1. **Create an Account**
   - Sign up with email and password
   - Choose your preferred language

2. **Join or Create Chat Rooms**
   - Create public or private rooms
   - Join existing rooms

3. **Start Chatting**
   - Type messages in your preferred language
   - Messages automatically translate to recipients' languages
   - Use voice input for hands-free messaging

4. **Voice Features**
   - Click microphone button for speech-to-text
   - Messages can be read aloud using text-to-speech

## 🌍 Supported Languages

- English (en)
- Spanish (es)
- French (fr)
- German (de)
- Italian (it)
- Portuguese (pt)
- Russian (ru)
- Chinese (zh)
- Japanese (ja)
- Korean (ko)
- Arabic (ar)
- Hindi (hi)
- Bengali (bn)
- Tamil (ta)
- Telugu (te)
- Marathi (mr)
- Gujarati (gu)
- Kannada (kn)
- Malayalam (ml)
- Punjabi (pa)
- Urdu (ur)

## 🏗 Project Structure

```
multilingual-chat-translator/
├── server/                 # Backend application
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Express middleware
│   ├── utils/             # Utility functions
│   └── index.js           # Server entry point
├── client/                # Frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── store/         # Redux store
│   │   ├── services/      # API and socket services
│   │   └── App.js         # Main App component
│   └── public/            # Static files
├── package.json           # Root package file
└── README.md             # This file
```

## 🔧 Configuration

### Server Configuration (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/multilingual-chat
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
GOOGLE_TRANSLATE_API_KEY=your-api-key
CLIENT_URL=http://localhost:3000
```

### Client Configuration (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SERVER_URL=http://localhost:5000
REACT_APP_ENV=development
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/logout` - User logout

### Chat Endpoints
- `GET /api/chat/rooms` - Get user's chat rooms
- `POST /api/chat/rooms` - Create new room
- `GET /api/chat/rooms/:id` - Get room details
- `POST /api/chat/rooms/:id/join` - Join room
- `GET /api/chat/rooms/:id/messages` - Get room messages

### User Endpoints
- `GET /api/user/search` - Search users
- `GET /api/user/online` - Get online users
- `GET /api/user/:id` - Get user profile

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- CORS protection
- Input validation and sanitization

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

Note: Voice features require browser support for Web Speech API.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

- **Varun Bansal** - Market Analysis & Feedback Collection
- **Raushan Kumar** - Full Stack Research & Revenue Analysis
- **Deepak Kumar** - Google Form Creation & Survey Analysis
- **Ankush Gupta** - Cost Analysis & Survey Data Summarization

## 🙏 Acknowledgments

- Google Translate API for translation services
- Socket.io for real-time communication
- Web Speech API for voice features
- React and Redux communities
- TailwindCSS for styling utilities
