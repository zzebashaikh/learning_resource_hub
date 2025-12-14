# Postman API Documentation - Learning Resource Hub

Complete API documentation for the Learning Resource Hub backend API. This guide covers all endpoints, authentication, and how to use the Postman collection.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Importing Postman Collection](#importing-postman-collection)
3. [Environment Setup](#environment-setup)
4. [Authentication & JWT](#authentication--jwt)
5. [API Endpoints](#api-endpoints)
6. [Protected vs Public APIs](#protected-vs-public-apis)
7. [Admin-Only APIs](#admin-only-apis)
8. [Exporting Collection for GitHub](#exporting-collection-for-github)

---

## Quick Start

1. **Import Collection**: Import `postman_collection.json` into Postman
2. **Import Environment**: Import `postman_environment.json` into Postman
3. **Start Backend**: Ensure your backend server is running on `http://localhost:5001`
4. **Register/Login**: Use the Register or Login endpoint to get a JWT token
5. **Token Auto-Save**: The token is automatically saved to the environment after login/register

---

## Importing Postman Collection

### Method 1: Import from File

1. Open Postman
2. Click **Import** button (top left)
3. Select **File** tab
4. Choose `postman_collection.json`
5. Click **Import**

### Method 2: Import from Link (if hosted)

1. Open Postman
2. Click **Import** button
3. Select **Link** tab
4. Paste the collection URL
5. Click **Import**

---

## Environment Setup

### Import Environment

1. In Postman, click **Environments** (left sidebar)
2. Click **Import**
3. Select `postman_environment.json`
4. Click **Import**

### Environment Variables

The environment includes two variables:

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `base_url` | `http://localhost:5001` | Base URL for all API requests |
| `token` | (empty) | JWT token (auto-populated after login/register) |

### Select Environment

1. In Postman, click the environment dropdown (top right)
2. Select **"Learning Resource Hub - Local"**

### Update Base URL (if needed)

If your server runs on a different port:

1. Click on **Environments** → **Learning Resource Hub - Local**
2. Edit the `base_url` value
3. Click **Save**

---

## Authentication & JWT

### How JWT Authentication Works

1. **Register/Login**: User registers or logs in → Server returns JWT token
2. **Token Storage**: Token is automatically saved to `{{token}}` environment variable
3. **Protected Requests**: Include token in `Authorization` header:
   ```
   Authorization: Bearer {{token}}
   ```
4. **Token Validation**: Server verifies token and attaches user to request

### JWT Token Details

- **Format**: `Bearer <token>`
- **Expiration**: 30 days
- **Contains**: User ID
- **Header Format**: `Authorization: Bearer <your_jwt_token>`

### Automatic Token Management

The Postman collection includes **Test Scripts** that automatically save tokens:

- **Register User**: Saves token after successful registration
- **Login User**: Saves token after successful login

You don't need to manually copy/paste tokens!

### Manual Token Update (if needed)

1. Copy token from login/register response
2. Go to **Environments** → **Learning Resource Hub - Local**
3. Paste token into `token` variable
4. Click **Save**

---

## API Endpoints

### Authentication Endpoints

#### 1. Register User
- **Endpoint**: `POST {{base_url}}/api/auth/register`
- **Access**: Public
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Success Response** (201):
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "user": {
        "id": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "learner"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```
- **Error Response** (400):
  ```json
  {
    "success": false,
    "message": "User already exists with this email"
  }
  ```

#### 2. Login User
- **Endpoint**: `POST {{base_url}}/api/auth/login`
- **Access**: Public
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Success Response** (200):
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "user": {
        "id": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "learner"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```
- **Error Response** (401):
  ```json
  {
    "success": false,
    "message": "Invalid credentials"
  }
  ```

#### 3. Get Current User
- **Endpoint**: `GET {{base_url}}/api/auth/me`
- **Access**: Protected (requires JWT)
- **Headers**: `Authorization: Bearer {{token}}`
- **Success Response** (200):
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "learner",
        "bookmarks": []
      }
    }
  }
  ```

---

### Resource Endpoints

#### 1. Get All Resources
- **Endpoint**: `GET {{base_url}}/api/resources`
- **Access**: Public
- **Query Parameters**:
  - `search` (optional): Search in title/description
  - `category` (optional): Filter by category
  - `sort` (optional): `newest`, `oldest`, `rating`, `likes` (default: `newest`)
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)
- **Example**: `GET {{base_url}}/api/resources?search=react&category=Web Development&sort=rating&page=1&limit=10`
- **Success Response** (200):
  ```json
  {
    "success": true,
    "count": 10,
    "total": 25,
    "page": 1,
    "pages": 3,
    "data": {
      "resources": [...]
    }
  }
  ```

#### 2. Get Single Resource
- **Endpoint**: `GET {{base_url}}/api/resources/:id`
- **Access**: Public
- **URL Parameters**: `id` (Resource ID)
- **Success Response** (200):
  ```json
  {
    "success": true,
    "data": {
      "resource": {
        "_id": "507f1f77bcf86cd799439011",
        "title": "React Documentation",
        "description": "Official React documentation",
        "category": "Web Development",
        "link": "https://react.dev",
        "createdBy": {
          "_id": "507f1f77bcf86cd799439012",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "likes": [],
        "ratings": [],
        "averageRating": 0,
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    }
  }
  ```

#### 3. Create Resource
- **Endpoint**: `POST {{base_url}}/api/resources`
- **Access**: Protected (requires JWT)
- **Headers**: 
  - `Authorization: Bearer {{token}}`
  - `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "title": "React Documentation",
    "description": "Official React documentation and guides",
    "category": "Web Development",
    "link": "https://react.dev"
  }
  ```
- **Valid Categories**: `Web Development`, `Mobile Development`, `Data Science`, `Machine Learning`, `Programming Languages`, `Database`, `DevOps`, `UI/UX Design`, `Cybersecurity`, `Other`
- **Success Response** (201):
  ```json
  {
    "success": true,
    "message": "Resource created successfully",
    "data": { "resource": {...} }
  }
  ```

#### 4. Update Resource
- **Endpoint**: `PUT {{base_url}}/api/resources/:id`
- **Access**: Protected (creator or admin only)
- **Headers**: 
  - `Authorization: Bearer {{token}}`
  - `Content-Type: application/json`
- **URL Parameters**: `id` (Resource ID)
- **Request Body** (all fields optional):
  ```json
  {
    "title": "Updated Title",
    "description": "Updated description",
    "category": "Mobile Development",
    "link": "https://updated-link.com"
  }
  ```
- **Success Response** (200):
  ```json
  {
    "success": true,
    "message": "Resource updated successfully",
    "data": { "resource": {...} }
  }
  ```
- **Error Response** (403):
  ```json
  {
    "success": false,
    "message": "Not authorized to update this resource"
  }
  ```

#### 5. Delete Resource
- **Endpoint**: `DELETE {{base_url}}/api/resources/:id`
- **Access**: Protected (creator or admin only)
- **Headers**: `Authorization: Bearer {{token}}`
- **URL Parameters**: `id` (Resource ID)
- **Success Response** (200):
  ```json
  {
    "success": true,
    "message": "Resource deleted successfully"
  }
  ```

#### 6. Like/Unlike Resource
- **Endpoint**: `PUT {{base_url}}/api/resources/:id/like`
- **Access**: Protected (requires JWT)
- **Headers**: `Authorization: Bearer {{token}}`
- **URL Parameters**: `id` (Resource ID)
- **Description**: Toggles like status. If already liked, unlikes. If not liked, likes.
- **Success Response** (200):
  ```json
  {
    "success": true,
    "message": "Resource liked", // or "Resource unliked"
    "data": { "resource": {...} }
  }
  ```

#### 7. Rate Resource
- **Endpoint**: `POST {{base_url}}/api/resources/:id/rate`
- **Access**: Protected (requires JWT)
- **Headers**: 
  - `Authorization: Bearer {{token}}`
  - `Content-Type: application/json`
- **URL Parameters**: `id` (Resource ID)
- **Request Body**:
  ```json
  {
    "rating": 5
  }
  ```
- **Rating Range**: 1-5 (integer)
- **Note**: If user already rated, updates existing rating
- **Success Response** (200):
  ```json
  {
    "success": true,
    "message": "Resource rated successfully",
    "data": { "resource": {...} }
  }
  ```

#### 8. Get My Resources
- **Endpoint**: `GET {{base_url}}/api/resources/user/my-resources`
- **Access**: Protected (requires JWT)
- **Headers**: `Authorization: Bearer {{token}}`
- **Description**: Get all resources created by the current authenticated user
- **Success Response** (200):
  ```json
  {
    "success": true,
    "count": 2,
    "data": {
      "resources": [...]
    }
  }
  ```

---

### User Endpoints

#### 1. Get All Users (Admin Only)
- **Endpoint**: `GET {{base_url}}/api/users`
- **Access**: Protected + Admin Only
- **Headers**: `Authorization: Bearer {{token}}`
- **Success Response** (200):
  ```json
  {
    "success": true,
    "count": 5,
    "data": {
      "users": [
        {
          "_id": "507f1f77bcf86cd799439011",
          "name": "John Doe",
          "email": "john@example.com",
          "role": "learner",
          "bookmarks": [],
          "createdAt": "2024-01-15T10:30:00.000Z"
        }
      ]
    }
  }
  ```
- **Error Response** (403):
  ```json
  {
    "success": false,
    "message": "Access denied. Admin privileges required."
  }
  ```

#### 2. Toggle Bookmark
- **Endpoint**: `PUT {{base_url}}/api/users/bookmark/:resourceId`
- **Access**: Protected (requires JWT)
- **Headers**: `Authorization: Bearer {{token}}`
- **URL Parameters**: `resourceId` (Resource ID)
- **Description**: Toggles bookmark status. If already bookmarked, removes bookmark. If not bookmarked, adds bookmark.
- **Success Response** (200):
  ```json
  {
    "success": true,
    "message": "Resource bookmarked", // or "Bookmark removed"
    "data": {
      "bookmarks": ["507f1f77bcf86cd799439011"]
    }
  }
  ```

#### 3. Get Bookmarks
- **Endpoint**: `GET {{base_url}}/api/users/bookmarks`
- **Access**: Protected (requires JWT)
- **Headers**: `Authorization: Bearer {{token}}`
- **Description**: Get all bookmarked resources for the current user
- **Success Response** (200):
  ```json
  {
    "success": true,
    "count": 2,
    "data": {
      "bookmarks": [...]
    }
  }
  ```

---

## Protected vs Public APIs

### Public APIs (No Authentication Required)

These endpoints can be accessed without a JWT token:

1. `POST /api/auth/register` - Register user
2. `POST /api/auth/login` - Login user
3. `GET /api/resources` - Get all resources
4. `GET /api/resources/:id` - Get single resource

### Protected APIs (Authentication Required)

These endpoints **require** a JWT token in the `Authorization` header:

1. `GET /api/auth/me` - Get current user
2. `POST /api/resources` - Create resource
3. `PUT /api/resources/:id` - Update resource (creator/admin only)
4. `DELETE /api/resources/:id` - Delete resource (creator/admin only)
5. `PUT /api/resources/:id/like` - Like/unlike resource
6. `POST /api/resources/:id/rate` - Rate resource
7. `GET /api/resources/user/my-resources` - Get my resources
8. `PUT /api/users/bookmark/:resourceId` - Toggle bookmark
9. `GET /api/users/bookmarks` - Get bookmarks

**How to use**: Include header:
```
Authorization: Bearer {{token}}
```

---

## Admin-Only APIs

These endpoints require **both authentication AND admin role**:

1. `GET /api/users` - Get all users

### Admin Access Requirements

- User must be authenticated (valid JWT token)
- User's `role` must be `"admin"` (not `"learner"`)

### Error Response (403 Forbidden)

If a non-admin user tries to access an admin endpoint:

```json
{
  "success": false,
  "message": "Access denied. Admin privileges required."
}
```

### How to Create an Admin User

Admin users cannot be created through the API (security feature). To create an admin:

1. Register a user normally (they will be `learner` by default)
2. Manually update the user's role in MongoDB:
   ```javascript
   db.users.updateOne(
     { email: "admin@example.com" },
     { $set: { role: "admin" } }
   )
   ```

---

## Exporting Collection for GitHub

### Step 1: Export Collection

1. Open Postman
2. Click on **"Learning Resource Hub API"** collection (left sidebar)
3. Click the **three dots** (⋯) next to the collection name
4. Select **Export**
5. Choose **Collection v2.1** format
6. Click **Export**
7. Save as `postman_collection.json` in your project root

### Step 2: Export Environment

1. Click on **Environments** (left sidebar)
2. Click the **three dots** (⋯) next to **"Learning Resource Hub - Local"**
3. Select **Export**
4. Save as `postman_environment.json` in your project root

### Step 3: Commit to GitHub

```bash
# Add files to git
git add postman_collection.json
git add postman_environment.json
git add POSTMAN_API_DOCUMENTATION.md

# Commit
git commit -m "Add Postman API documentation and collection"

# Push to GitHub
git push origin main
```

### Step 4: Update .gitignore (Optional)

If you want to exclude environment files from version control (since they may contain tokens):

Add to `.gitignore`:
```
postman_environment.json
```

**Note**: The environment file in this repo has an empty token, so it's safe to commit. However, if you add real tokens, exclude it from git.

---

## Testing Workflow

### Recommended Testing Order

1. **Register User** → Get token automatically saved
2. **Login User** → Verify token refresh (optional)
3. **Get Current User** → Verify authentication works
4. **Create Resource** → Test protected endpoint
5. **Get All Resources** → Verify resource appears
6. **Get Single Resource** → Use ID from step 4
7. **Like Resource** → Test like functionality
8. **Rate Resource** → Test rating (1-5)
9. **Bookmark Resource** → Test bookmark
10. **Get Bookmarks** → Verify bookmark retrieval
11. **Get My Resources** → Verify user's resources
12. **Update Resource** → Test update (as creator)
13. **Delete Resource** → Test delete (as creator)
14. **Get All Users** → Test admin endpoint (requires admin role)

---

## Common Issues

### Issue: "Not authorized, no token provided"

**Solution**: 
- Ensure you've logged in/registered first
- Check that the environment variable `token` is set
- Verify the `Authorization` header is included: `Bearer {{token}}`

### Issue: "Access denied. Admin privileges required."

**Solution**: 
- The endpoint requires admin role
- Create an admin user manually in MongoDB (see Admin section above)
- Login with admin credentials

### Issue: "Not authorized to update/delete this resource"

**Solution**: 
- You can only update/delete resources you created
- Or you need admin role
- Verify you're using the correct resource ID

### Issue: Token expired

**Solution**: 
- Tokens expire after 30 days
- Simply login again to get a new token
- Token will be automatically saved

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- Resource IDs are MongoDB ObjectIds
- Passwords are hashed with bcrypt (never returned in responses)
- JWT tokens expire after 30 days
- All new users are assigned `learner` role by default
- Admin roles must be assigned manually in the database

---

## Related Files

- `postman_collection.json` - Postman collection with all endpoints
- `postman_environment.json` - Postman environment variables
- `backend/routes/` - Route definitions
- `backend/controllers/` - Controller logic
- `backend/middleware/` - Authentication and authorization middleware

---

## Support

For issues or questions:
1. Check the backend server logs
2. Verify MongoDB is running
3. Ensure environment variables are set correctly
4. Check that the server is running on the correct port (default: 5001)

---

**Last Updated**: January 2024
**API Version**: 1.0.0
