# 🔴 Real-Time Chat App (MERN + Socket.IO)

A real-time 1-on-1 chat application built using the MERN stack with Socket.IO for real-time communication and JWT for authentication.

## 🚀 Tech Stack

- **Frontend**: React.js, React Router, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Atlas)
- **Authentication**: JSON Web Token (JWT)
- **Real-Time**: Socket.IO
- **Optional State Management**: Zustand / Context API / Redux

---

## 📸 Features

### 🔐 Authentication
- User Signup & Login
- JWT-based authentication
- Protected chat route
- Token stored in `localStorage`

### 💬 Chat Functionality
- List of registered users
- 1-on-1 chat with real-time messaging using Socket.IO
- Messages include timestamps
- Messages aligned left/right for sender/receiver

### 🗃️ Backend Features
- REST APIs:
  - `POST /api/auth/signup`
  - `POST /api/auth/login`
  - `GET /api/users` (protected)
- MongoDB Models:
  - `User`: name, email, hashed password
  - `Message`: senderId, receiverId, content, timestamp
- Socket.IO Events:
  - `connection`, `disconnect`
  - `user-join`, `chat-message`

---

## 📁 Project Structure

### 🔙 Backend (`/backend`)
backend/
├── controllers/
├── models/
├── routes/
├── socket/
├── middleware/
├── utils/
├── server.js
└── .env
### 🔜 Frontend (`/frontend`)
frontend/
├── components/
├── pages/
├── context/ or store/
├── utils/
├── App.jsx
└── main.jsx

## ⚙️ Setup Instructions

### 📦 Backend Setup

## Go to the `backend` folder:
   ```bash
   cd server
   npm install
   PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
## Run the server
npm run dev


## Go to the frontend folder:
cd client
npm install
## run the client
npm start
