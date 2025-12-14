# Learning Resource Hub

A complete MERN stack application for sharing and managing learning resources. Built with MongoDB (local), Express.js, React, and Node.js.

## Project Overview

Learning Resource Hub is a platform where users can:
- Register and login securely using JWT authentication
- Share learning resources (articles, tutorials, courses, etc.)
- Search and filter resources by category
- Like and bookmark favorite resources
- Rate resources (1-5 stars)
- Manage their own resources (edit/delete)
- Access a personal dashboard

**Admin Features:**
- View all users
- Delete any resource

## Architecture

### Backend Structure

```
backend/
├── config/
│   └── db.js                 # MongoDB connection configuration
├── models/
│   ├── User.js               # User schema (name, email, password, role, bookmarks)
│   └── Resource.js           # Resource schema (title, description, category, link, etc.)
├── controllers/
│   ├── authController.js     # Authentication logic (register, login)
│   ├── resourceController.js # Resource CRUD operations
│   └── userController.js     # User operations (bookmarks, admin functions)
├── routes/
│   ├── auth.js               # Authentication routes
│   ├── resources.js          # Resource routes
│   └── users.js              # User routes
├── middleware/
│   ├── auth.js               # JWT authentication middleware
│   └── admin.js              # Admin role verification middleware
├── utils/
│   └── errorHandler.js       # Centralized error handling
├── server.js                 # Express server entry point
├── package.json              # Dependencies and scripts
└── .env.example             # Environment variables template
```

### Database Schema

#### User Model
- `name`: String (required)
- `email`: String (required, unique)
- `password`: String (required, hashed with bcrypt)
- `role`: String (enum: 'learner' or 'admin', default: 'learner')
- `bookmarks`: Array of Resource IDs
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

#### Resource Model
- `title`: String (required)
- `description`: String (required)
- `category`: String (required, enum: Web Development, Mobile Development, etc.)
- `link`: String (required, must be valid URL)
- `createdBy`: ObjectId (reference to User)
- `likes`: Array of User IDs
- `ratings`: Array of rating objects (user + rating value 1-5)
- `averageRating`: Number (calculated automatically)
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

##  Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Compass installed and running locally
- npm or yarn package manager

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env`
   - Update the following values:
     ```
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/learning_resource_hub
     JWT_SECRET=your_super_secret_jwt_key_here
     NODE_ENV=development
     ```

4. **Start MongoDB:**
   - Open MongoDB Compass
   - Connect to: `mongodb://localhost:27017`
   - The database `learning_resource_hub` will be created automatically on first run

5. **Start the server:**
   ```bash
   # Development mode (with auto-reload)
   npm run dev

   # Production mode
   npm start
   ```

   Server will run on `http://localhost:5000`

## API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Resource Routes (`/api/resources`)
- `GET /api/resources` - Get all resources (supports search, filter, pagination)
- `GET /api/resources/:id` - Get single resource
- `POST /api/resources` - Create resource (Protected)
- `PUT /api/resources/:id` - Update resource (Protected - creator or admin only)
- `DELETE /api/resources/:id` - Delete resource (Protected - creator or admin only)
- `PUT /api/resources/:id/like` - Like/unlike resource (Protected)
- `POST /api/resources/:id/rate` - Rate resource 1-5 stars (Protected)
- `GET /api/resources/user/my-resources` - Get current user's resources (Protected)

### User Routes (`/api/users`)
- `GET /api/users` - Get all users (Protected - Admin only)
- `PUT /api/users/bookmark/:resourceId` - Toggle bookmark (Protected)
- `GET /api/users/bookmarks` - Get user's bookmarks (Protected)

### Query Parameters

**Get Resources:**
- `?search=keyword` - Search in title/description
- `?category=Web Development` - Filter by category
- `?sort=newest|oldest|rating|likes` - Sort results
- `?page=1` - Page number (default: 1)
- `?limit=10` - Items per page (default: 10)

## Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. **Register/Login:** Returns a JWT token
2. **Protected Routes:** Include token in Authorization header:
   ```
   Authorization: Bearer <your_jwt_token>
   ```

## Features Implemented

- User registration and login (JWT)
- Role-based access control (Admin vs Learner)
- CRUD operations for resources
- Search and filter resources
- Like/unlike resources
- Bookmark resources
- Rate resources (1-5 stars)
- Personal dashboard (my resources)
- Admin can view all users
- Admin can delete any resource
- Clean, modular architecture
- Comprehensive error handling

---

**Status:** Backend Complete | Frontend Pending

