# Backend Architecture Documentation

## 📐 System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (React)                        │
│                    (To be implemented)                      │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP/HTTPS
                           │ REST API Calls
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    EXPRESS SERVER                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Middleware Layer                                    │   │
│  │  - CORS                                              │   │
│  │  - JSON Parser                                       │   │
│  │  - Authentication (JWT)                              │   │
│  │  - Authorization (Admin Check)                       │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Routes Layer                                         │   │
│  │  /api/auth    → Authentication routes                 │   │
│  │  /api/resources → Resource CRUD routes               │   │
│  │  /api/users    → User management routes               │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Controllers Layer                                    │   │
│  │  - authController.js                                 │   │
│  │  - resourceController.js                             │   │
│  │  - userController.js                                 │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ Mongoose ODM
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              MONGODB (Local - Compass)                      │
│  ┌──────────────────┐        ┌──────────────────┐         │
│  │   Users          │        │   Resources      │         │
│  │   Collection     │◄───────│   Collection     │         │
│  └──────────────────┘        └──────────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

## Folder Structure Explanation

### `/config`
**Purpose:** Configuration files for external services
- `db.js`: MongoDB connection setup using Mongoose
- Handles connection string and error handling

### `/models`
**Purpose:** Database schemas and data models
- `User.js`: Defines user structure (name, email, password, role, bookmarks)
- `Resource.js`: Defines resource structure (title, description, category, link, etc.)
- Uses Mongoose schemas with validation and middleware

### `/controllers`
**Purpose:** Business logic and request handling
- `authController.js`: Handles registration, login, token generation
- `resourceController.js`: Handles all resource operations (CRUD, like, rate, search)
- `userController.js`: Handles user operations (bookmarks, admin functions)

### `/routes`
**Purpose:** API endpoint definitions
- `auth.js`: `/api/auth/*` endpoints
- `resources.js`: `/api/resources/*` endpoints
- `users.js`: `/api/users/*` endpoints
- Routes connect HTTP methods to controller functions

### `/middleware`
**Purpose:** Request processing functions
- `auth.js`: JWT token verification (protect routes)
- `admin.js`: Role-based access control (admin check)
- Middleware runs before controllers

### `/utils`
**Purpose:** Utility functions and helpers
- `errorHandler.js`: Centralized error handling middleware

### Root Files
- `server.js`: Main entry point, starts Express server
- `package.json`: Dependencies and npm scripts

## Request Flow

1. **Client Request** → Express Server
2. **Middleware** → CORS, JSON parsing, Authentication check
3. **Route Matching** → Finds appropriate route handler
4. **Controller** → Executes business logic
5. **Model/Database** → Queries MongoDB
6. **Response** → Returns JSON to client

## Authentication Flow

```
User Registration/Login
    ↓
Generate JWT Token (contains user ID)
    ↓
Client stores token
    ↓
Protected Route Request
    ↓
Middleware extracts token from header
    ↓
Verify token signature
    ↓
Find user in database
    ↓
Attach user to request object
    ↓
Controller processes request
```

## Database Relationships

### User → Resource (One-to-Many)
- One user can create many resources
- `Resource.createdBy` references `User._id`

### User ↔ Resource (Many-to-Many)
- **Likes:** User can like multiple resources, Resource can be liked by multiple users
- **Bookmarks:** User can bookmark multiple resources (stored in User.bookmarks array)
- **Ratings:** User can rate multiple resources, Resource can have multiple ratings

## Key Design Patterns

1. **MVC Pattern:** Models (data), Views (API responses), Controllers (logic)
2. **Middleware Pattern:** Request processing pipeline
3. **RESTful API:** Standard HTTP methods (GET, POST, PUT, DELETE)
4. **Separation of Concerns:** Each module has a single responsibility

## API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

## Security Features

1. **Password Hashing:** bcrypt with salt rounds
2. **JWT Tokens:** Secure token-based authentication
3. **Role-Based Access:** Admin vs Learner permissions
4. **Input Validation:** Mongoose schema validators
5. **CORS:** Cross-origin resource sharing enabled

