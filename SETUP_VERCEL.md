# Frontend Deployment - Vercel & EAS (Expo)

## Option 1: Web Deployment on Vercel

### Prerequisites
- Vercel account (create at https://vercel.com)
- GitHub repository with your code
- Backend already deployed on Render

### Step 1: Connect GitHub to Vercel

1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Click "Continue with GitHub"
4. Authorize Vercel to access GitHub
5. Select your repository
6. Click "Import"

### Step 2: Configure Environment Variables

1. In Vercel dashboard, go to "Settings" → "Environment Variables"
2. Add the following variables:

```
VITE_API_BASE_URL=https://energeia-backend.onrender.com
VITE_SOCKET_URL=https://energeia-backend.onrender.com
VITE_API_TIMEOUT=30000
VITE_GOOGLE_MAPS_API_KEY_IOS=YOUR_IOS_KEY
VITE_GOOGLE_MAPS_API_KEY_ANDROID=YOUR_ANDROID_KEY
VITE_ENABLE_DEBUG_LOGS=false
VITE_ENABLE_MOCK_DATA=false
VITE_ENV=production
```

**Important**: Use your actual Render backend URL (e.g., `https://energeia-backend.onrender.com`)

### Step 3: Deploy

Click "Deploy"

Vercel will:
- Clone your repository
- Install dependencies
- Build the project
- Deploy to CDN

You'll get a URL like: `https://energeia.vercel.app`

### Step 4: Update Backend CORS

1. Go to your Render backend service
2. Go to "Environment"
3. Update `CORS_ORIGIN`:
```
CORS_ORIGIN=https://energeia.vercel.app,https://yourdomain.com
```
4. Click "Save Changes"
5. Backend will auto-deploy

### Step 5: Enable Auto-Deploy

1. Vercel automatically deploys on push to main
2. You can disable auto-deploy in Settings if needed

### Step 6: Test Web Deployment

Visit: `https://energeia.vercel.app`

The app should:
- Load without errors
- Connect to your Render backend
- Allow login/registration

## Option 2: Mobile Deployment with EAS (Expo)

### Prerequisites
- Expo account (create at https://expo.dev)
- EAS CLI installed: `npm install -g eas-cli`
- Apple Developer account (for iOS)
- Google Play Developer account (for Android)

### Step 1: Set Up EAS Project

```bash
# Log in to Expo
eas login

# Initialize EAS
eas build:configure

# This creates/updates eas.json
```

### Step 2: Configure app.json for Production

Update `app.json`:

```json
{
  "expo": {
    "extra": {
      "API_BASE_URL": "https://energeia-backend.onrender.com",
      "SOCKET_URL": "https://energeia-backend.onrender.com",
      "GOOGLE_MAPS_API_KEY_IOS": "YOUR_PRODUCTION_IOS_KEY",
      "GOOGLE_MAPS_API_KEY_ANDROID": "YOUR_PRODUCTION_ANDROID_KEY",
      "ENABLE_DEBUG_LOGS": false,
      "ENV": "production"
    }
  }
}
```

### Step 3: Build for Android

```bash
# Build for Android
eas build --platform android --auto-submit

# Options:
# --release  : Build release version
# --preview  : Build preview for testing
# --auto-submit : Automatically submit to Play Store
```

This will:
1. Build your app
2. Create a signed APK/AAB
3. (Optional) Submit to Google Play

### Step 4: Build for iOS

```bash
# Build for iOS
eas build --platform ios --auto-submit

# (Optional) Submit to App Store
eas submit --platform ios
```

### Step 5: Monitor Build Progress

```bash
# Check build status
eas build:list

# Watch build logs
eas build:view
```

### Step 6: Configure App Store Submission

For **Google Play**:
1. Go to https://play.google.com/console
2. Create new app
3. Fill in app details
4. Enable production build in EAS

For **Apple App Store**:
1. Go to https://appstoreconnect.apple.com
2. Create new app
3. Fill in app details
4. Enable production build in EAS

## Environment Variable Management

### Local Development
.env.local:
```
VITE_API_BASE_URL=http://localhost:5001
```

### Staging (if needed)
.env.staging:
```
VITE_API_BASE_URL=https://staging-backend.onrender.com
```

### Production
.env.production:
```
VITE_API_BASE_URL=https://energeia-backend.onrender.com
```

### Vercel Environment Variables
Dashboard → Settings → Environment Variables:
```
VITE_API_BASE_URL=https://energeia-backend.onrender.com
```

### EAS Secrets (for sensitive data)

```bash
# Create a secret
eas secret create

# Set for specific build profile
eas build --platform ios --profile production
```

## Verification Checklist

### Web (Vercel)
- [ ] Vercel deployment successful
- [ ] App loads at https://energeia.vercel.app
- [ ] Can log in with backend
- [ ] API calls work correctly
- [ ] No CORS errors in console
- [ ] Environment variables loaded correctly

### Mobile (EAS)
- [ ] Android build successful
- [ ] iOS build successful
- [ ] Can install on test device
- [ ] App connects to backend
- [ ] All features working
- [ ] No console errors

### Full Stack
- [ ] Frontend → Backend communication works
- [ ] Authentication flows work
- [ ] File uploads work
- [ ] Real-time features (WebSocket) work
- [ ] Database queries return correct data
- [ ] Error handling works properly

## Troubleshooting

### CORS Errors
```
Access to XMLHttpRequest blocked by CORS policy
```
Solution:
1. Check backend CORS_ORIGIN includes frontend URL
2. Redeploy backend after updating CORS
3. Wait 30 seconds for changes to apply
4. Clear browser cache

### Environment Variables Not Loading
Solution:
1. Verify variables in Vercel/EAS settings
2. Redeploy after changing variables
3. Check variable names are exactly correct
4. Clear browser cache and hard refresh

### Backend Connection Failed
```
Failed to fetch from https://energeia-backend.onrender.com
```
Solution:
1. Check backend is deployed on Render
2. Test backend directly: curl https://energeia-backend.onrender.com/health
3. Verify CORS_ORIGIN is correct
4. Check JWT_SECRET is set
5. Review backend logs in Render dashboard

### Maps Not Showing
Solution:
1. Check Google Maps API keys in environment variables
2. Verify keys are enabled in Google Cloud Console
3. Check API restrictions allow your app
4. For iOS: Verify APN configuration

## Next Steps

1. **Set up monitoring**
   - Sentry for error tracking
   - LogRocket for session replay
   - UptimeRobot for backend uptime

2. **Set up CI/CD**
   - Automated testing on PR
   - Automated deployment on merge to main

3. **Configure analytics**
   - Google Analytics
   - Firebase Analytics

4. **Set up email notifications**
   - Deploy alerts
   - User notifications
   - Admin alerts

## Production Best Practices

1. **Use HTTPS everywhere**
   - Vercel provides free SSL
   - Render provides free SSL

2. **Implement rate limiting**
   - Already configured in backend config
   - Enable in production

3. **Monitor performance**
   - Set up error tracking (Sentry)
   - Set up performance monitoring (DataDog)

4. **Regular backups**
   - MongoDB Atlas handles automatic backups
   - Keep 7-30 days of backups

5. **Security updates**
   - Keep dependencies updated
   - npm audit regularly
   - Review security advisories
