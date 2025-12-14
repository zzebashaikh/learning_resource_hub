# Learning Resource Hub - Frontend

React frontend application for Learning Resource Hub.

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Backend server running on port 5001

### Installation

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm start
   ```

   The app will open at `http://localhost:3000`

## Project Structure

```
frontend/
├── public/
│   └── index.html          # HTML template
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Navbar.jsx      # Navigation bar with dark mode
│   │   ├── ResourceCard.jsx # Resource display card
│   │   ├── SearchBar.jsx   # Search and filter component
│   │   └── LoadingSpinner.jsx
│   ├── pages/              # Page components
│   │   ├── Home.jsx        # Landing page
│   │   ├── Login.jsx       # Login page
│   │   ├── Register.jsx    # Registration page
│   │   ├── Dashboard.jsx    # User dashboard
│   │   ├── Resources.jsx   # All resources page
│   │   └── Admin.jsx       # Admin panel
│   ├── context/            # Context API
│   │   └── AuthContext.jsx # Authentication context
│   ├── services/           # API service layer
│   │   └── api.js          # Axios configuration and API calls
│   ├── utils/              # Utility functions
│   │   └── ProtectedRoute.jsx # Route guard component
│   ├── App.jsx             # Main app component with routing
│   ├── index.js           # Entry point
│   └── index.css           # Global styles with dark mode
├── package.json
└── README.md
```

## Key Features

### Authentication
- JWT token stored in localStorage
- Automatic token injection in API requests
- Protected routes with authentication check
- Role-based access control (admin vs learner)

### Pages
- **Home**: Landing page with featured resources
- **Login/Register**: Authentication pages
- **Resources**: Browse all resources with search/filter
- **Dashboard**: User's personal dashboard (my resources, bookmarks)
- **Admin**: Admin panel (users and resources management)

### Components
- **Navbar**: Navigation with dark mode toggle
- **ResourceCard**: Displays resource with like/bookmark/rate actions
- **SearchBar**: Search and category filter
- **LoadingSpinner**: Loading indicator

### Dark Mode
- Toggle between light and dark themes
- Preference stored in localStorage
- CSS variables for easy theme switching

## 🔧 Configuration

### API Proxy
The `package.json` includes a proxy setting:
```json
"proxy": "http://localhost:5001"
```

This allows API calls to `/api/*` to be proxied to the backend server.

### Environment Variables (Optional)
Create `.env` file for custom configuration:
```
REACT_APP_API_URL=http://localhost:5001/api
```

## API Integration

All API calls are handled through `services/api.js`:
- `authAPI`: Authentication endpoints
- `resourceAPI`: Resource CRUD operations
- `userAPI`: User operations (bookmarks, admin)

Axios interceptors automatically:
- Add JWT token to requests
- Handle 401 errors (logout on token expiry)

## Styling

- CSS Variables for theming
- Responsive design (mobile-friendly)
- Dark mode support
- Utility classes for common patterns

## Protected Routes

Routes protected with authentication:
- `/dashboard` - Requires login
- `/admin` - Requires admin role

Usage:
```jsx
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

## Build for Production

```bash
npm run build
```

Creates optimized production build in `build/` directory.

---

**Status**: Frontend Complete | Ready for Testing

