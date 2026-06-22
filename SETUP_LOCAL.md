# Local Development Setup

## Prerequisites
- Node.js 18+ and npm
- MongoDB (local or MongoDB Atlas)
- Expo CLI (`npm install -g expo-cli`)

## Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Create Environment File
```bash
# Copy the example file
cp .env.example .env.local

# Edit with your local values
nano .env.local
```

### 3. Configure MongoDB
For **local MongoDB**:
```
MONGODB_URI=mongodb://localhost:27017/energeia-dev
```

For **MongoDB Atlas** (cloud):
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster and database
3. Get connection string
4. Update .env.local:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/energeia-dev?retryWrites=true&w=majority
```

### 4. Generate JWT Secret
```bash
# On Linux/Mac
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((Get-Random -SetSeed 0 -Count 32 | ForEach-Object {[char]$_})))
```
Add the generated secret to .env.local:
```
JWT_SECRET=your-generated-secret-here
```

### 5. Start Backend
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

You should see:
```
✓ MongoDB connected: localhost
Server running on port 5001
```

## Frontend Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Environment File
```bash
# Copy the example file
cp .env.example .env.local

# Edit with your values
nano .env.local
```

Ensure these settings:
```
VITE_API_BASE_URL=http://localhost:5001
VITE_SOCKET_URL=http://localhost:5001
VITE_ENV=development
```

### 3. Add Google Maps API Keys

1. Go to https://console.cloud.google.com/
2. Create a new project
3. Enable Maps API for Android and iOS
4. Create API keys
5. Add to .env.local:
```
VITE_GOOGLE_MAPS_API_KEY_IOS=YOUR_KEY_HERE
VITE_GOOGLE_MAPS_API_KEY_ANDROID=YOUR_KEY_HERE
```

### 4. Update app.json
Update the `extra` section in app.json with your Google Maps keys:
```json
"extra": {
  "API_BASE_URL": "http://localhost:5001",
  "SOCKET_URL": "http://localhost:5001",
  "GOOGLE_MAPS_API_KEY_IOS": "YOUR_IOS_KEY",
  "GOOGLE_MAPS_API_KEY_ANDROID": "YOUR_ANDROID_KEY"
}
```

### 5. Start Frontend

#### Web (easiest for testing)
```bash
npm run web
```
Opens at http://localhost:19006

#### Android
```bash
npm run android
```

#### iOS
```bash
npm run ios
```

## Android Networking Setup (Important!)

**Android devices/emulators cannot reach `localhost:5001` directly.**

The app automatically handles this, but you need to understand:

### Android Emulator (Automatic ✅)
- Localhost automatically converts to `10.0.2.2:5001`
- Just use `npm run android`
- No additional configuration needed
- App will log: `[Config] Android detected, converting localhost to 10.0.2.2:5001`

### Physical Android Device (Manual Configuration ⚙️)

1. **Find your machine IP**:
   - Windows: Run `ipconfig` → look for IPv4 Address (e.g., 192.168.1.100)
   - Mac/Linux: Run `ifconfig` → look for inet address

2. **Configure .env.local**:
   ```env
   # Option A: Set machine IP
   VITE_MACHINE_IP=192.168.1.100

   # Option B: Direct IP in URL
   VITE_API_BASE_URL=http://192.168.1.100:5001
   VITE_SOCKET_URL=http://192.168.1.100:5001
   ```

3. **Ensure both are on same network**:
   - Phone and development machine must be on same WiFi

4. **Check backend CORS**:
   ```bash
   # backend/.env.local
   CORS_ORIGIN=http://localhost:3000,http://10.0.2.2,http://192.168.1.100
   ```

5. **Start app**:
   ```bash
   npm run android
   ```

For complete troubleshooting, see [ANDROID_NETWORK_GUIDE.md](ANDROID_NETWORK_GUIDE.md)

## Verify Local Setup

1. **Backend Health Check**
```bash
curl http://localhost:5001/health
# Should return: {"success": true, "message": "Server is running"}
```

2. **Test API Call**
Open browser and visit:
```
http://localhost:5001/health
```

3. **Frontend Connection**
The app should connect to localhost:5001 and show the login screen

## Common Issues

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Start MongoDB locally or check MONGODB_URI in .env.local

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5001
```
**Solution**: Change PORT in .env.local or kill process on port 5001

### Environment Variables Not Loading
**Solution**: 
- Make sure .env.local exists in the correct directory
- Restart the development server after editing .env.local
- Check file is not in .gitignore accidentally

### Socket Connection Failed
```
Failed to connect socket
```
**Solution**:
- Ensure VITE_SOCKET_URL points to running backend
- Check CORS_ORIGIN includes frontend origin in backend .env.local
- Restart backend server
- For Android: See [ANDROID_NETWORK_GUIDE.md](ANDROID_NETWORK_GUIDE.md)

### Android Network Request Failed
```
ERROR [API] Network request failed at http://localhost:5001
```
**Solution**: 
- This is normal on Android! Localhost can't be reached
- The app automatically converts to 10.0.2.2 (emulator) or VITE_MACHINE_IP (physical device)
- Check backend is running
- For physical device: Set VITE_MACHINE_IP to your machine's IP address
- See [ANDROID_NETWORK_GUIDE.md](ANDROID_NETWORK_GUIDE.md) for complete setup

## Next Steps
- Set up database with initial data (see database setup docs)
- Configure authentication (see auth setup docs)
- Deploy to production (see deployment guides)
