# Quick Reference Guide

## Environment Configuration System

This document provides a quick reference for the environment configuration implemented in the Energeia project.

## File Structure

```
energeia-app/
├── .env.local (local dev - never commit)
├── .env.production (production - never commit)
├── .env.example (template - commit this)
├── app.json (environment variables in extra section)
├── services/
│   ├── config.ts (NEW - configuration service)
│   └── apiClient.ts (UPDATED - uses config)
├── backend/
│   ├── .env.local (local dev - never commit)
│   ├── .env.production (production - never commit)
│   ├── .env.example (template - commit this)
│   ├── config/
│   │   ├── env.js (NEW - configuration service)
│   │   └── db.js (UPDATED - uses config)
│   └── server.js (UPDATED - uses config)
└── docs/
    ├── SETUP_LOCAL.md (NEW)
    ├── SETUP_RENDER.md (NEW)
    ├── SETUP_VERCEL.md (NEW)
    └── VERIFICATION_CHECKLIST.md (NEW)
```

## Environment Variables Overview

### Frontend Variables (VITE_*)

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5001        # Backend URL
VITE_SOCKET_URL=http://localhost:5001          # WebSocket URL
VITE_API_TIMEOUT=30000                          # Request timeout (ms)

# Google Maps
VITE_GOOGLE_MAPS_API_KEY_IOS=...               # iOS Maps key
VITE_GOOGLE_MAPS_API_KEY_ANDROID=...           # Android Maps key

# Feature Flags
VITE_ENABLE_DEBUG_LOGS=true|false              # Debug logging
VITE_ENABLE_MOCK_DATA=true|false               # Use mock data

# Environment
VITE_ENV=development|production                 # Environment type
```

### Backend Variables

```env
# Server
NODE_ENV=development|production                # Environment
PORT=5001                                       # Server port

# Database
MONGODB_URI=mongodb://...                       # Database URL
MONGO_MAX_POOL_SIZE=20                          # Connection pool
MONGO_MIN_POOL_SIZE=2                           # Connection pool

# CORS
CORS_ORIGIN=http://...,https://...            # Allowed origins

# JWT
JWT_SECRET=your-secret                          # JWT signing key
JWT_EXPIRATION=7d                               # Token expiry

# Email
SMTP_HOST=smtp.gmail.com                        # Email server
SMTP_USER=your-email@gmail.com                  # Email account
SMTP_PASSWORD=app-password                      # Email password

# Feature Flags
ENABLE_DEBUG_LOGS=true|false                    # Debug logging
ENABLE_MOCK_DATA=true|false                     # Use mock data

# Environment
ENV=development|production                      # Environment type
```

## Quick Setup

### Local Development

```bash
# 1. Frontend setup
cp .env.example .env.local
# Edit .env.local - set VITE_API_BASE_URL=http://localhost:5001

# 2. Backend setup
cd backend
cp .env.example .env.local
# Edit .env.local - configure MONGODB_URI and JWT_SECRET

# 3. Start services
cd backend && npm run dev      # Terminal 1
npm run web                    # Terminal 2 (in root)

# 4. Verify
curl http://localhost:5001/health
```

### Production Deployment

```bash
# 1. Backend on Render
- Connect GitHub repository
- Add environment variables from .env.production
- Deploy

# 2. Frontend on Vercel
- Connect GitHub repository
- Add environment variables from .env.production
- Deploy

# 3. Update CORS
- Add frontend URL to backend CORS_ORIGIN
- Redeploy backend

# 4. Verify
- Test frontend at https://your-app.vercel.app
- Check backend at https://your-backend.onrender.com/health
```

## How It Works

### Frontend (Expo/React Native)

1. **Environment Variables Resolution**
   - First, tries `expo-constants.expoConfig.extra`
   - Falls back to `process.env.VITE_*`
   - Uses default values as last resort

2. **Configuration Loading**
   - `services/config.ts` exports `config` object
   - `apiClient.ts` imports `config` and uses it
   - All API calls use dynamic URLs from config

3. **Build-Time Variables**
   - Web: Uses .env.local or .env.production at build time
   - Mobile: Uses app.json extra section
   - EAS: Can inject variables during build

### Backend (Node.js)

1. **Configuration Loading**
   - `backend/config/env.js` loads from process.env
   - Validates required variables on startup
   - Provides safe defaults for non-sensitive vars

2. **Service Initialization**
   - Database uses configured MONGODB_URI
   - CORS uses configured origins
   - JWT uses configured secret

3. **Health Checks**
   - `/health` endpoint shows configuration status
   - Logs show environment and configuration
   - Easy to verify correct setup

## Common Scenarios

### Scenario 1: Local Development → Local Backend

```
Frontend: .env.local
  VITE_API_BASE_URL=http://localhost:5001

Backend: .env.local
  MONGODB_URI=mongodb://localhost:27017/energeia-dev
  CORS_ORIGIN=http://localhost:3000,http://localhost:19006

Result: ✅ Works perfectly
```

### Scenario 2: Local Development → Production Backend

```
Frontend: .env.local
  VITE_API_BASE_URL=https://your-backend.onrender.com

Backend: Already deployed on Render with prod config

Result: ✅ Useful for testing production environment locally
```

### Scenario 3: Vercel Frontend → Render Backend

```
Frontend (Vercel environment variables):
  VITE_API_BASE_URL=https://your-backend.onrender.com

Backend (Render environment variables):
  CORS_ORIGIN=https://your-app.vercel.app
  MONGODB_URI=mongodb+srv://...@cluster.mongodb.net

Result: ✅ Full production setup
```

### Scenario 4: Mobile App (EAS) → Production Backend

```
app.json extra section:
  "API_BASE_URL": "https://your-backend.onrender.com"

Backend: Production configuration on Render

Result: ✅ Mobile app connected to production
```

## Validation

### Frontend Validation

The config service automatically validates:
- ✅ All required variables present
- ✅ Valid URL formats
- ✅ No localhost URLs in production
- ✅ Proper timeout configuration

### Backend Validation

The config service automatically validates:
- ✅ MONGODB_URI configured
- ✅ JWT_SECRET set (strong check in production)
- ✅ CORS_ORIGIN configured in production
- ✅ Database connection format valid

## Best Practices

### ✅ DO
- Use environment variables for all configurable values
- Commit .env.example files
- Generate JWT secret with: `openssl rand -base64 32`
- Use strong, unique secrets per environment
- Validate configuration on startup
- Log safe configuration info (not passwords)

### ❌ DON'T
- Commit .env or .env.local files
- Use hardcoded URLs in code
- Use same JWT secret everywhere
- Store passwords in Git history
- Use localhost URLs in production
- Disable CORS security in production
- Log sensitive data

## Environment Variables by Environment

### Development (.env.local)

| Variable | Value |
|----------|-------|
| VITE_API_BASE_URL | http://localhost:5001 |
| NODE_ENV | development |
| MONGODB_URI | mongodb://localhost:27017/energeia-dev |
| JWT_SECRET | test-secret-change-me |
| ENABLE_DEBUG_LOGS | true |

### Production (Render + Vercel)

| Variable | Value |
|----------|-------|
| VITE_API_BASE_URL | https://your-backend.onrender.com |
| NODE_ENV | production |
| MONGODB_URI | mongodb+srv://user:pass@cluster.mongodb.net |
| JWT_SECRET | [generated with openssl] |
| ENABLE_DEBUG_LOGS | false |

## Troubleshooting

### Issue: "VITE_API_BASE_URL is not configured"
```bash
# Solution:
1. Create .env.local
2. Add: VITE_API_BASE_URL=http://localhost:5001
3. Restart dev server
```

### Issue: CORS error from frontend
```bash
# Solution:
1. Check backend CORS_ORIGIN includes frontend URL
2. Redeploy backend after changes
3. Clear browser cache
```

### Issue: WebSocket not connecting
```bash
# Solution:
1. Verify VITE_SOCKET_URL is correct
2. Check backend supports WebSocket
3. Verify firewall allows WebSocket
```

### Issue: Database connection fails
```bash
# Solution:
1. Verify MONGODB_URI is correct
2. Check MongoDB is running
3. Test connection with MongoDB Compass
4. Check IP whitelist (MongoDB Atlas)
```

## Security Checklist

Before deploying to production:

- [ ] JWT_SECRET is strong and random
- [ ] Database credentials are secure
- [ ] CORS_ORIGIN doesn't include localhost
- [ ] HTTPS is enabled everywhere
- [ ] API keys are restricted
- [ ] Secrets not in Git history
- [ ] Environment variables set in hosting platform
- [ ] .env.local not committed
- [ ] Debug logs disabled
- [ ] Error messages don't leak information

## Migration Guide (From Hardcoded URLs)

If upgrading from hardcoded URLs:

1. **Frontend**
   ```typescript
   // Before
   const API_BASE_URL = 'https://ev-backend-didr.onrender.com';

   // After
   import { getApiUrl } from '@/services/config';
   const API_BASE_URL = getApiUrl();
   ```

2. **Backend**
   ```javascript
   // Before
   const PORT = 5001;
   const corsOrigin = 'http://localhost:3000';

   // After
   const config = require('./config/env');
   const PORT = config.server.port;
   const corsOptions = config.cors;
   ```

## Documentation Files

1. **SETUP_LOCAL.md** - Complete local development setup
2. **SETUP_RENDER.md** - Backend deployment on Render
3. **SETUP_VERCEL.md** - Frontend deployment on Vercel
4. **VERIFICATION_CHECKLIST.md** - Pre/post deployment checklist
5. **QUICK_REFERENCE.md** - This file

## Next Steps

1. Copy .env.example files to .env.local
2. Configure local values in .env.local
3. Start local development
4. Test API connectivity
5. Deploy to production following guides
6. Verify with checklist

## Support

For issues:
1. Check the relevant setup guide
2. Review VERIFICATION_CHECKLIST.md
3. Check logs for error messages
4. Test individual components
5. Verify all environment variables

Remember: Environment variables are essential for multi-environment support. Take time to set them up correctly!
