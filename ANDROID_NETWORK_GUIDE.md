# Android Network Connection Troubleshooting

## The Problem

When running the Energeia app on Android (emulator or physical device), you may see:
```
ERROR [API] Network request failed 
  at http://localhost:5001/api/auth/login
```

**Root Cause**: Android cannot reach `localhost:5001` because:
- **Android Emulator**: localhost refers to the emulator itself, not the host machine
- **Physical Android Device**: localhost refers to the device, not your development machine

## The Solution

The app automatically detects Android and converts localhost to the correct address:

### Android Emulator (Automatic ✅)
```
localhost:5001 → 10.0.2.2:5001
```
- `10.0.2.2` is the special IP to reach the host machine from Android emulator
- This works automatically with no configuration needed
- You should see a log: `[Config] Android detected, converting localhost to 10.0.2.2:5001`

### Physical Android Device (Manual Configuration ⚙️)

For a physical device on your local network, use your machine's IP address.

#### Step 1: Find Your Machine IP

**Windows**:
```cmd
ipconfig
```
Look for "IPv4 Address" under your active network connection:
```
IPv4 Address. . . . . . . . . . : 192.168.1.100
```

**Mac**:
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

**Linux**:
```bash
hostname -I
```

Usually appears as: `192.168.1.X` or `10.0.0.X`

#### Step 2: Configure .env.local

Edit `.env.local` and uncomment/set:
```env
VITE_API_BASE_URL=http://localhost:5001
VITE_MACHINE_IP=192.168.1.100  # Replace with your actual IP
```

Or directly use the IP:
```env
VITE_API_BASE_URL=http://192.168.1.100:5001
VITE_SOCKET_URL=http://192.168.1.100:5001
```

#### Step 3: Restart Development Server
```bash
npm run android
# or reload the app
```

## Verification Steps

### 1. Check Backend is Running
```bash
# Should return: {"success": true, "message": "Server is running"}
curl http://localhost:5001/health
```

### 2. Check Android Logs
When app starts, look for this log:
```
[Config] Android detected, converting localhost to 10.0.2.2:5001
```

### 3. Test API Connection
Try login:
1. Open app on Android
2. Check console for: `[API] Request {"hasBody": true, "method": "POST", "url": "http://10.0.2.2:5001/api/auth/login"}`
3. Should succeed (or fail with auth error, not network error)

## Common Issues

### Issue: Still getting "Network request failed"

**Check 1: Backend Running?**
```bash
curl http://localhost:5001/health
```
If this fails, start backend: `npm run dev` in backend folder

**Check 2: Firewall Blocking?**
Windows Firewall may block Node.js
- Open Windows Defender Firewall
- Click "Allow an app through firewall"
- Find "Node.js" or "node.exe"
- Check both "Private" and "Public"

**Check 3: CORS Configuration?**
Backend CORS_ORIGIN must include Android origin
```env
# backend/.env.local
CORS_ORIGIN=http://localhost:3000,http://localhost:19006,http://10.0.2.2,http://192.168.1.100
```

**Check 4: Correct IP Address?**
Physical device must be on same network as development machine
```bash
# From your machine
ping 192.168.1.XXX  # Your device's IP

# From your device, can you reach backend?
# Test with another app or browser
curl http://192.168.1.100:5001/health
```

### Issue: Works on emulator but not physical device

**Solution**: Set `VITE_MACHINE_IP` to your machine's actual IP
```env
VITE_MACHINE_IP=192.168.1.100
```

### Issue: Backend unreachable on same network

**Check networking**:
1. Both machine and device on same WiFi? 
2. Firewall not blocking port 5001?
3. Network doesn't have "WiFi isolation" enabled?

**Test directly from device**:
```bash
# On your physical device, open terminal/adb shell
adb shell

# Try to reach backend
curl http://192.168.1.100:5001/health
```

## Platform-Specific Notes

### iOS
- iOS simulator can use `http://localhost:5001`
- Physical iOS device needs machine IP (like Android)
- Usually "just works" with localhost in simulator

### Android Emulator
- Automatically converted to `10.0.2.2`
- No configuration needed
- Slowest option (significant overhead)

### Android Physical Device
- Requires `VITE_MACHINE_IP` environment variable
- Must be on same network as development machine
- Fastest option (better performance)

### Web (Browser)
- Uses regular `http://localhost:5001`
- No conversion needed

## Configuration Reference

### Automatic Conversion (Android Only)
File: `services/config.ts` - `convertLocalhostUrl()` function

```typescript
// If Android and localhost, converts to:
// http://10.0.2.2:PORT (for emulator)
// http://VITE_MACHINE_IP:PORT (if VITE_MACHINE_IP set)
```

### Environment Variables

| Variable | Used For | Example |
|----------|----------|---------|
| `VITE_API_BASE_URL` | API calls | http://localhost:5001 |
| `VITE_SOCKET_URL` | WebSocket | http://localhost:5001 |
| `VITE_MACHINE_IP` | Android device IP | 192.168.1.100 |

## Testing Checklist

- [ ] Backend running: `curl http://localhost:5001/health` returns success
- [ ] Android emulator: logs show "converting localhost to 10.0.2.2:5001"
- [ ] Physical device: configured with `VITE_MACHINE_IP`
- [ ] Firewall allows port 5001 traffic
- [ ] CORS_ORIGIN in backend includes device origin
- [ ] Can make API request without network error
- [ ] WebSocket connects successfully

## Debug Logging

Enable detailed logging in `.env.local`:
```env
VITE_ENABLE_DEBUG_LOGS=true
ENABLE_DEBUG_LOGS=true
```

Then check:
1. **Frontend logs** (console in Expo)
2. **Backend logs** (terminal running `npm run dev`)
3. **Network tab** in browser dev tools

## Advanced: Custom Machine Detection

If auto-detection doesn't work, you can manually override:

Edit `.env.local`:
```env
# Force specific IP for all Android
VITE_MACHINE_IP=192.168.1.100

# Or use different IPs for different scenarios
VITE_API_BASE_URL=http://192.168.1.100:5001
VITE_SOCKET_URL=http://192.168.1.100:5001
```

## Production vs Development

**Development (localhost)**:
```env
VITE_API_BASE_URL=http://localhost:5001
VITE_MACHINE_IP=192.168.1.100  # Only used on Android
```

**Production (cloud backend)**:
```env
VITE_API_BASE_URL=https://your-backend.onrender.com
VITE_MACHINE_IP=                # Not used in production
```

## Getting Help

If still having issues:

1. Check both .env.local and backend .env.local are configured
2. Verify backend is running: `npm run dev` in backend folder
3. Test backend directly: `curl http://localhost:5001/health`
4. Check firewall allows port 5001
5. Review app logs for specific error messages
6. Try Android emulator first (simpler setup)

## Summary

| Environment | Localhost → Actual |
|---|---|
| iOS Simulator | localhost:5001 (no change) |
| Android Emulator | 10.0.2.2:5001 (auto) |
| Android Device | 192.168.1.X:5001 (set VITE_MACHINE_IP) |
| Web Browser | localhost:5001 (no change) |
| Production | https://backend.onrender.com |

The app now handles Android networking automatically! 🚀
