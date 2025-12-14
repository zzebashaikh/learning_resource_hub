# Frontend Architecture Explanation

## Frontend Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    REACT APPLICATION                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Context API (AuthContext)                            │   │
│  │  - Stores JWT token                                    │   │
│  │  - Manages user state                                  │   │
│  │  - Provides auth functions (login, logout, register)   │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  React Router                                          │   │
│  │  - Public Routes (/, /login, /register)               │   │
│  │  - Protected Routes (/dashboard, /my-resources)        │   │
│  │  - Admin Routes (/admin)                               │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Components Layer                                      │   │
│  │  - Pages (Home, Login, Register, Dashboard)            │   │
│  │  - Components (Navbar, ResourceCard, SearchBar)       │   │
│  │  - ProtectedRoute (Route Guard)                      │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Services Layer (Axios)                               │   │
│  │  - API calls to backend                               │   │
│  │  - Request interceptors (add JWT token)               │   │
│  │  - Response interceptors (handle errors)              │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP Requests
                           │ (with JWT in headers)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              BACKEND API (Port 5001)                         │
│              Express.js + MongoDB                            │
└─────────────────────────────────────────────────────────────┘
```

## Folder Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.jsx
│   │   ├── ResourceCard.jsx
│   │   ├── SearchBar.jsx
│   │   └── LoadingSpinner.jsx
│   ├── pages/               # Page components
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Resources.jsx
│   │   └── Admin.jsx
│   ├── context/             # Context API
│   │   └── AuthContext.jsx
│   ├── services/            # API service layer
│   │   └── api.js
│   ├── utils/               # Utility functions
│   │   └── ProtectedRoute.jsx
│   ├── App.jsx              # Main app component with routes
│   ├── index.js             # Entry point
│   └── index.css            # Global styles
├── package.json
└── README.md
```

## JWT Storage and Usage

### 1. **Storage Location: localStorage**

**Why localStorage?**
- Persists across browser sessions
- Survives page refreshes
- Accessible from any component
- Simple to implement

**Storage Format:**
```javascript
localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
```

### 2. **JWT Flow in Frontend**

```
User Login
    ↓
Backend returns JWT token
    ↓
Store in localStorage
    ↓
Update AuthContext state
    ↓
Axios interceptor adds token to all requests
    ↓
Protected routes check token
    ↓
If token invalid/expired → Redirect to login
```

### 3. **Token Usage in API Calls**

**Axios Interceptor Setup:**
```javascript
// Automatically adds token to every request
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**Manual Token Usage:**
```javascript
// In API service
const token = localStorage.getItem('token');
axios.get('/api/resources', {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
```

### 4. **Token Validation**

- **On App Load:** Check if token exists in localStorage
- **On Protected Route Access:** Verify token is present
- **On API Response 401:** Token expired/invalid → Logout user
- **On Logout:** Remove token from localStorage

## Protected Routes Explanation

### What are Protected Routes?

Routes that require authentication. Users must be logged in to access them.

### Implementation Strategy

**1. ProtectedRoute Component:**
```javascript
// Checks if user is authenticated
// If yes → Render the component
// If no → Redirect to login
```

**2. Usage:**
```javascript
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

### Protected Route Logic

```
User tries to access /dashboard
    ↓
ProtectedRoute checks: Is token in localStorage?
    ↓
YES → Check AuthContext: Is user logged in?
    ↓
YES → Render Dashboard component
    ↓
NO → Redirect to /login (with return URL)
```

### Admin Route Protection

**Additional check for admin routes:**
```javascript
// Check if user.role === 'admin'
if (user.role !== 'admin') {
  return <Navigate to="/" />;
}
```

## 📊 Dashboard Logic Explanation

### Dashboard Features

1. **User Profile Section**
   - Display user name, email, role
   - Show total resources created
   - Show total bookmarks

2. **My Resources Section**
   - List all resources created by current user
   - Edit/Delete buttons (only for own resources)
   - Quick stats (total, likes, ratings)

3. **Bookmarked Resources**
   - Display all bookmarked resources
   - Quick access to favorites

4. **Quick Actions**
   - Create new resource button
   - View all resources link
   - Admin panel link (if admin)

### Dashboard Data Flow

```
Dashboard Component Mounts
    ↓
Fetch user data from AuthContext
    ↓
API Call: GET /api/resources/user/my-resources
    ↓
API Call: GET /api/users/bookmarks
    ↓
Display data in sections
    ↓
Handle edit/delete actions
    ↓
Update UI after changes
```

### State Management in Dashboard

```javascript
const [myResources, setMyResources] = useState([]);
const [bookmarks, setBookmarks] = useState([]);
const [loading, setLoading] = useState(true);
const { user } = useContext(AuthContext);
```

## Dark Mode Implementation

### Strategy

1. **Theme Context or Local State:**
   - Store theme preference in localStorage
   - Toggle between 'light' and 'dark'
   - Apply CSS classes based on theme

2. **CSS Variables:**
   - Define color variables for light/dark themes
   - Switch variables on theme change

3. **Implementation:**
```javascript
const [theme, setTheme] = useState(
  localStorage.getItem('theme') || 'light'
);

useEffect(() => {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}, [theme]);
```

## 🔄 Component Communication Flow

```
AuthContext (Global State)
    ↓
Provides: { user, token, login, logout, register }
    ↓
Used by:
  - Navbar (show user name, logout button)
  - ProtectedRoute (check authentication)
  - Dashboard (display user info)
  - All pages (access user data)
```

## API Integration Pattern

### Service Layer Pattern

**Why separate API service?**
- Centralized API configuration
- Reusable API functions
- Easy to update endpoints
- Consistent error handling

**Example:**
```javascript
// services/api.js
export const authAPI = {
  login: (email, password) => axios.post('/api/auth/login', { email, password }),
  register: (name, email, password) => axios.post('/api/auth/register', { name, email, password }),
  getMe: () => axios.get('/api/auth/me')
};

// In component
import { authAPI } from '../services/api';
const response = await authAPI.login(email, password);
```

## Key React Patterns Used

1. **Functional Components:** Modern React (no class components)
2. **Hooks:** useState, useEffect, useContext, useNavigate
3. **Context API:** Global state management (no Redux needed)
4. **Custom Hooks:** Reusable logic (if needed)
5. **Component Composition:** Build complex UIs from simple components

## Security Considerations

1. **Token Storage:** localStorage (vulnerable to XSS, but simple for exam)
2. **Token Expiration:** Backend handles, frontend redirects on 401
3. **Route Protection:** Client-side (backend also validates)
4. **Input Validation:** Both frontend and backend

---

**Ready to implement!** This architecture is exam-safe, viva-ready, and follows React best practices.

