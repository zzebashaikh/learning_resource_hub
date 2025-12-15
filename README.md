# Learning Resource Hub

A full-stack MERN application for sharing, discovering, and managing educational resources. Built with MongoDB, Express.js, React, and Node.js for local development.

## Description

Learning Resource Hub enables users to discover, share, and organize learning resources in a collaborative environment. The platform supports user authentication, resource management, social features like likes and ratings, and administrative capabilities for content moderation.

## Key Features

### User Features
- User registration and authentication with JWT
- Create, edit, and delete personal learning resources
- Search and filter resources by category
- Like and bookmark favorite resources
- Rate resources with 1-5 star ratings
- Personal dashboard with resource management
- View bookmarked resources

### Admin Features
- View all registered users
- Delete any resource for content moderation
- Administrative oversight of platform content

## Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (local instance via MongoDB Compass)
- **ODM:** Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **State Management:** React Context API
- **Icons:** Lucide React

## Project Architecture

### Backend Structure
```
backend/
├── config/
│   └── db.js                 # MongoDB connection configuration
├── models/
│   ├── User.js               # User schema and methods
│   └── Resource.js           # Resource schema and methods
├── controllers/
│   ├── authController.js     # Authentication logic
│   ├── resourceController.js # Resource CRUD operations
│   └── userController.js     # User operations
├── routes/
│   ├── auth.js               # Authentication routes
│   ├── resources.js          # Resource routes
│   └── users.js              # User routes
├── middleware/
│   ├── auth.js               # JWT authentication middleware
│   └── admin.js              # Admin role verification
├── utils/
│   └── errorHandler.js       # Centralized error handling
└── server.js                 # Express server entry point
```

### Frontend Structure
```
frontend/
├── src/
│   ├── components/           # Reusable UI components
│   ├── pages/                # Page components
│   ├── context/              # React Context providers
│   ├── services/             # API service layer
│   └── utils/                # Utility functions
└── index.html                # Entry HTML file
```

## Database Schema

### User Model
- `name` (String, required)
- `email` (String, required, unique, lowercase)
- `password` (String, required, hashed with bcrypt)
- `role` (String, enum: 'learner' | 'admin', default: 'learner')
- `bookmarks` (Array of Resource ObjectIds)
- `createdAt`, `updatedAt` (Timestamps)

### Resource Model
- `title` (String, required, max 100 characters)
- `description` (String, required, max 500 characters)
- `category` (String, required, enum: Web Development, Mobile Development, Data Science, etc.)
- `link` (String, required, valid URL)
- `createdBy` (ObjectId, reference to User)
- `likes` (Array of User ObjectIds)
- `ratings` (Array of rating objects with user and rating value 1-5)
- `averageRating` (Number, calculated automatically)
- `createdAt`, `updatedAt` (Timestamps)

## Local Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB installed locally (via MongoDB Compass or mongod)
- npm or yarn package manager

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the `backend` directory with:
   ```env
   MONGO_URI=mongodb://localhost:27017/learning_resource_hub
   PORT=5001
   JWT_SECRET=devsecret
   NODE_ENV=development
   ```

4. Start MongoDB:
   - Open MongoDB Compass
   - Connect to `mongodb://localhost:27017`
   - The database `learning_resource_hub` will be created automatically on first run

5. Start the backend server:
   ```bash
   npm run dev
   ```
   The server will run on `http://localhost:5001`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The application will run on `http://localhost:5173`

## API Overview

### Authentication Routes (`/api/auth`)
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user and receive JWT token
- `GET /api/auth/me` - Get current authenticated user (Protected)

### Resource Routes (`/api/resources`)
- `GET /api/resources` - Get all resources (supports query parameters)
- `GET /api/resources/:id` - Get single resource by ID
- `POST /api/resources` - Create new resource (Protected)
- `PUT /api/resources/:id` - Update resource (Protected, creator or admin only)
- `DELETE /api/resources/:id` - Delete resource (Protected, creator or admin only)
- `PUT /api/resources/:id/like` - Like or unlike resource (Protected)
- `POST /api/resources/:id/rate` - Rate resource 1-5 stars (Protected)
- `GET /api/resources/user/my-resources` - Get current user's resources (Protected)

### User Routes (`/api/users`)
- `GET /api/users` - Get all users (Protected, Admin only)
- `PUT /api/users/bookmark/:resourceId` - Toggle bookmark for resource (Protected)
- `GET /api/users/bookmarks` - Get user's bookmarked resources (Protected)

### Query Parameters

**GET /api/resources:**
- `?search=keyword` - Search in title and description
- `?category=Web Development` - Filter by category
- `?sort=newest|oldest|rating|likes` - Sort results
- `?page=1` - Page number (default: 1)
- `?limit=10` - Items per page (default: 10)

## Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. **Registration/Login:** Returns a JWT token in the response
2. **Protected Routes:** Include the token in the Authorization header:
   ```
   Authorization: Bearer <your_jwt_token>
   ```
3. **Token Storage:** Frontend stores tokens in localStorage
4. **Token Expiration:** Tokens expire after 30 days

## Project Status

- **Backend:** Complete and functional
- **Frontend:** Complete and functional
- **Authentication:** Fully implemented with JWT
- **Database:** MongoDB local instance via MongoDB Compass

## License

This project is part of a learning resource management system.

---

**Built with:** MERN Stack (MongoDB, Express.js, React, Node.js)
