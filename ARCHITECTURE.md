# Dating App Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Mobile App                          │
│                     (React Native)                          │
│                                                             │
│  ┌─────────────┐         ┌──────────────┐                 │
│  │   Login     │         │    Swipe     │                 │
│  │   Screen    │────────▶│    Screen    │                 │
│  └─────────────┘         └──────────────┘                 │
│                                 │                           │
│                                 │                           │
│                         ┌───────▼────────┐                 │
│                         │  SwipeCard     │                 │
│                         │  Component     │                 │
│                         └────────────────┘                 │
└─────────────────────────────────────────────────────────────┘
                               │
                               │ HTTP/REST
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                      Backend API                            │
│                  (.NET Web API)                             │
│                                                             │
│  ┌──────────────────┐         ┌──────────────────┐        │
│  │ AuthController   │         │ SwipeController  │        │
│  │ - Login          │         │ - GetProfiles    │        │
│  │ - GetUser        │         │ - Swipe          │        │
│  │ - UpdateUser     │         │ - GetSwipeLimit  │        │
│  └──────────────────┘         └──────────────────┘        │
│            │                           │                    │
│            │                           │                    │
│            └───────────┬───────────────┘                   │
│                        │                                    │
│                        ▼                                    │
│            ┌────────────────────┐                          │
│            │   AppDbContext     │                          │
│            │ (Entity Framework) │                          │
│            └────────────────────┘                          │
└─────────────────────────────────────────────────────────────┘
                        │
                        │
                        ▼
            ┌────────────────────┐
            │   SQLite Database  │
            │                    │
            │  ┌──────────────┐ │
            │  │    Users     │ │
            │  └──────────────┘ │
            │  ┌──────────────┐ │
            │  │    Swipes    │ │
            │  └──────────────┘ │
            └────────────────────┘
```

## Data Flow

### 1. User Login Flow
```
User Input (Email) → LoginScreen → API.auth.login → AuthController
                                                           ↓
                                    Create/Find User ← AppDbContext
                                                           ↓
                                    Return User Object → Store userId
                                                           ↓
                                    Navigate to SwipeScreen
```

### 2. Swipe Flow
```
SwipeScreen Load → API.swipe.getProfiles → SwipeController
                                                    ↓
                            Filter Unswiped Users ← AppDbContext
                                                    ↓
                            Return Profile List → Display Cards
                                                    ↓
User Swipes Card → API.swipe.swipe → SwipeController
                                             ↓
                      Check Daily Limit ← AppDbContext (count swipes)
                                             ↓
                              ├─ Limit OK ──▶ Save Swipe → Update Counter
                              │
                              └─ Limit Reached ──▶ Return Error → Show Alert
```

### 3. Daily Limit Check Flow
```
SwipeController.Swipe()
    ↓
Query: COUNT swipes WHERE SwiperId = userId AND Date = today
    ↓
IF count >= 16
    ├─▶ Return 400 Error with limit info
    │
ELSE
    └─▶ Create new Swipe record
        ↓
    Return remaining swipes count
```

## API Endpoints

### Authentication Endpoints
```
POST /api/auth/login
  Request:  { email, name?, photoUrl?, authProvider }
  Response: User object with ID

GET /api/auth/user/{userId}
  Response: User object

PUT /api/auth/user/{userId}
  Request:  { name, bio, age, photoUrl }
  Response: Updated User object
```

### Swipe Endpoints
```
GET /api/swipe/profiles/{userId}
  Response: Array of UserProfile (users not yet swiped)

POST /api/swipe/swipe/{userId}
  Request:  { swipedUserId, isLike }
  Response: SwipeLimitResponse { swipesUsedToday, swipesRemaining, nextResetTime? }

GET /api/swipe/limit/{userId}
  Response: SwipeLimitResponse { swipesUsedToday, swipesRemaining, nextResetTime? }
```

## Database Schema

### Users Table
```sql
CREATE TABLE Users (
  Id            INTEGER PRIMARY KEY AUTOINCREMENT,
  Email         TEXT NOT NULL UNIQUE,
  Name          TEXT,
  PhotoUrl      TEXT,
  Bio           TEXT,
  Age           INTEGER NOT NULL,
  CreatedAt     TEXT NOT NULL,
  AuthProvider  TEXT NOT NULL  -- 'email' or 'google'
)
```

### Swipes Table
```sql
CREATE TABLE Swipes (
  Id            INTEGER PRIMARY KEY AUTOINCREMENT,
  SwiperId      INTEGER NOT NULL,  -- FK to Users
  SwipedUserId  INTEGER NOT NULL,  -- FK to Users
  IsLike        INTEGER NOT NULL,  -- 1 = like, 0 = pass
  CreatedAt     TEXT NOT NULL,
  FOREIGN KEY (SwiperId) REFERENCES Users(Id),
  FOREIGN KEY (SwipedUserId) REFERENCES Users(Id)
)

CREATE INDEX IX_Swipes_SwiperId ON Swipes(SwiperId)
CREATE INDEX IX_Swipes_SwipedUserId ON Swipes(SwipedUserId)
```

## Key Components

### Frontend (React Native)

**Screens:**
- `LoginScreen`: User authentication via email or Google
- `SwipeScreen`: Main interface for browsing and swiping profiles

**Components:**
- `SwipeCard`: Reusable profile card with swipe buttons

**Services:**
- `api.ts`: HTTP client using Axios for all API calls

**State Management:**
- React Hooks (useState, useEffect)
- AsyncStorage for persistent user session

### Backend (.NET)

**Controllers:**
- `AuthController`: User authentication and profile management
- `SwipeController`: Swipe operations and limit enforcement

**Models:**
- `User`: User account information
- `Swipe`: Swipe record (who swiped whom, like/pass)
- `AppDbContext`: EF Core database context

**DTOs (Data Transfer Objects):**
- `LoginRequest`: Login payload
- `UserProfileDto`: Profile display data
- `SwipeRequest`: Swipe action payload
- `SwipeLimitResponse`: Swipe limit status

## Security Considerations

**Current Implementation:**
- Basic authentication (user ID in requests)
- CORS enabled for all origins (development only)
- No password storage/validation
- No JWT tokens

**Production Recommendations:**
- Implement JWT token authentication
- Add password hashing (bcrypt/Argon2)
- Restrict CORS to specific origins
- Add rate limiting
- Implement HTTPS
- Add input validation and sanitization
- Implement proper session management

## Scalability Considerations

**Current Design:**
- SQLite for simple deployment
- Single server architecture
- No caching layer
- No CDN for images

**Scaling Strategy:**
- Migrate to PostgreSQL/MySQL for production
- Add Redis for caching swipe limits
- Implement CDN for profile images
- Add API gateway for load balancing
- Implement database read replicas
- Add message queue for async operations

## Technology Stack

**Frontend:**
- React Native 0.76+
- TypeScript 5.x
- React Navigation 6.x
- Axios for HTTP
- AsyncStorage for persistence
- Google Sign-In SDK

**Backend:**
- .NET 9.0
- ASP.NET Core Web API
- Entity Framework Core 9.0
- SQLite (development)
- OpenAPI/Swagger

**Development Tools:**
- Node.js 20+
- npm 10+
- Android SDK
- Visual Studio Code / Visual Studio

## Deployment Architecture

```
Production Deployment (Future):

┌──────────────────┐
│   Mobile App     │
│   (App Store)    │
└────────┬─────────┘
         │
         │ HTTPS
         │
    ┌────▼─────┐
    │   CDN    │ (Images)
    └──────────┘
         │
         │
    ┌────▼─────────────┐
    │  Load Balancer   │
    └────┬─────────────┘
         │
    ┌────▼─────┐
    │  API     │
    │ Servers  │ (Multiple instances)
    └────┬─────┘
         │
    ┌────▼─────────┐
    │   Database   │
    │  (Primary)   │
    └──────────────┘
         │
    ┌────▼─────────┐
    │   Database   │
    │  (Replica)   │
    └──────────────┘
```
