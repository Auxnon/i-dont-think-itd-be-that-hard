# Quick Start Guide

Get the dating app running in 5 minutes!

## Prerequisites Quick Check

```bash
# Check if you have the required tools
node --version    # Should be v20+
npm --version     # Should be v10+
dotnet --version  # Should be 9.0+
```

## 1. Start the Backend (30 seconds)

```bash
cd Backend
dotnet run
```

✅ Backend is running when you see: `Now listening on: http://localhost:5000`

Keep this terminal open!

## 2. Start the Frontend (2 minutes)

Open a new terminal:

```bash
cd Frontend
npm install   # First time only
npm start     # Start Metro bundler
```

Open another terminal:

```bash
cd Frontend
npm run android  # Requires Android emulator or device
```

## 3. Try It Out!

1. **Login Screen**
   - Enter any email (e.g., `demo@example.com`)
   - Click "Continue with Email"

2. **Swipe Screen**
   - You'll see "No more profiles" initially (database is empty)
   - Let's add some test users!

## 4. Add Test Users (Optional)

In a new terminal, run these commands to create sample profiles:

```bash
# Create Alice
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","name":"Alice","authProvider":"email"}'

# Update Alice's profile
curl -X PUT http://localhost:5000/api/auth/user/2 \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","bio":"Love hiking and photography","age":28}'

# Create Bob
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"bob@example.com","name":"Bob","authProvider":"email"}'

# Update Bob's profile
curl -X PUT http://localhost:5000/api/auth/user/3 \
  -H "Content-Type: application/json" \
  -d '{"name":"Bob","bio":"Music lover and chef","age":32}'
```

Now log out and log back in with your original account to see the profiles!

## 5. Test Swipe Limits

Try swiping 16 times - you'll hit the daily limit and see a message!

## Troubleshooting

### Backend won't start?
- Make sure port 5000 is not in use
- Check that .NET 9.0 SDK is installed: `dotnet --version`

### Frontend won't connect?
- For Android Emulator: API URL should be `http://10.0.2.2:5000/api`
- For Physical Device: Update API URL in `Frontend/src/services/api.ts` with your computer's IP

### Database issues?
- Delete `Backend/dating.db` and restart the backend to create a fresh database

### Android build errors?
- Ensure Android SDK is installed
- Check Java version: `java --version` (should be JDK 11 or higher)
- Run `cd android && ./gradlew clean` then try again

## Next Steps

- Add your own profile photo URL
- Try swiping left and right on different profiles
- Watch the swipe counter decrease
- Try to exceed the 16 swipe limit

## API Testing with curl

```bash
# Check your swipe limit
curl http://localhost:5000/api/swipe/limit/1

# Get available profiles
curl http://localhost:5000/api/swipe/profiles/1

# Make a swipe
curl -X POST http://localhost:5000/api/swipe/swipe/1 \
  -H "Content-Type: application/json" \
  -d '{"swipedUserId":2,"isLike":true}'
```

Happy swiping! 💕
