# Dating App

A simple dating app similar to Tinder/Bumble/Hinge with a React Native frontend (Android focus) and .NET backend.

## Features

- **Swipe Interface**: Swipe left to pass, swipe right to like profiles
- **Daily Limit**: Users have 16 swipes per day (resets at midnight UTC)
- **Authentication**: Support for both email login and Google Sign-In
- **Profile Management**: Users can view and edit their profiles
- **Real-time Tracking**: Track swipes and display remaining swipes

## Tech Stack

### Frontend
- React Native (Android focus)
- TypeScript
- React Navigation
- Axios for API calls
- AsyncStorage for local data persistence
- Google Sign-In integration

### Backend
- .NET 9.0
- ASP.NET Core Web API
- Entity Framework Core
- SQLite database
- RESTful API design

## Project Structure

```
.
├── Backend/                 # .NET Web API
│   ├── Controllers/        # API endpoints
│   ├── Models/            # Database models
│   ├── DTOs/              # Data transfer objects
│   └── Program.cs         # App configuration
├── Frontend/               # React Native app
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── screens/       # App screens
│   │   ├── services/      # API service layer
│   │   └── types/         # TypeScript types
│   └── android/           # Android-specific files
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v20+)
- npm or yarn
- .NET 9.0 SDK
- Android Studio (for Android development)
- Android SDK
- Java Development Kit (JDK)

### Backend Setup

1. Navigate to the Backend directory:
   ```bash
   cd Backend
   ```

2. Restore dependencies and build:
   ```bash
   dotnet restore
   dotnet build
   ```

3. Run the backend:
   ```bash
   dotnet run
   ```

   The API will start on `http://localhost:5000` (or as configured in `launchSettings.json`)

### Frontend Setup

1. Navigate to the Frontend directory:
   ```bash
   cd Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. For Google Sign-In, update the `webClientId` in `src/screens/LoginScreen.tsx` with your Google OAuth Client ID.

4. Update the API URL in `src/services/api.ts`:
   - For Android Emulator: `http://10.0.2.2:5000/api` (default)
   - For Physical Device: Use your computer's IP address (e.g., `http://192.168.1.100:5000/api`)

5. Start Metro bundler:
   ```bash
   npm start
   ```

6. In a new terminal, run the Android app:
   ```bash
   npm run android
   ```

## API Endpoints

### Authentication

- `POST /api/auth/login` - Login or create user
  ```json
  {
    "email": "user@example.com",
    "name": "User Name",
    "authProvider": "email" | "google"
  }
  ```

- `GET /api/auth/user/{userId}` - Get user details
- `PUT /api/auth/user/{userId}` - Update user profile

### Swipe

- `GET /api/swipe/profiles/{userId}` - Get available profiles to swipe
- `POST /api/swipe/swipe/{userId}` - Record a swipe
  ```json
  {
    "swipedUserId": 2,
    "isLike": true
  }
  ```

- `GET /api/swipe/limit/{userId}` - Get remaining swipe count

## Database

The app uses SQLite for simplicity. The database file (`dating.db`) is automatically created when you first run the backend.

### Schema

**Users Table:**
- Id (Primary Key)
- Email (Unique)
- Name
- PhotoUrl
- Bio
- Age
- CreatedAt
- AuthProvider

**Swipes Table:**
- Id (Primary Key)
- SwiperId (Foreign Key → Users)
- SwipedUserId (Foreign Key → Users)
- IsLike (Boolean)
- CreatedAt

## Configuration

### Backend Configuration

Edit `Backend/appsettings.json` to configure:
- Database connection string
- API settings

### Frontend Configuration

Edit `Frontend/src/services/api.ts` to update:
- API base URL
- Timeout settings

## Development Notes

- The daily swipe limit is set to 16 swipes per user per day
- Swipes reset at midnight UTC
- The backend uses CORS to allow requests from any origin (for development)
- For production, update CORS policy and add proper authentication/authorization

## Future Enhancements

- Add photo upload functionality
- Implement matching logic when both users like each other
- Add messaging between matched users
- Add profile filtering (age, location, etc.)
- Implement push notifications
- Add user preferences and settings
- Deploy to production servers

## License

This project is open source and available for educational purposes.