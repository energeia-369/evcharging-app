# Environment Configuration Verification Checklist

## Pre-Deployment Checklist

### Frontend Configuration

#### Local Development
- [ ] `.env.local` file created
- [ ] `VITE_API_BASE_URL=http://localhost:5001`
- [ ] `VITE_SOCKET_URL=http://localhost:5001`
- [ ] `VITE_ENV=development`
- [ ] Google Maps API keys added
- [ ] `app.json` extra variables configured
- [ ] `npm run web` loads without errors
- [ ] Can connect to local backend

#### Vercel Production
- [ ] Vercel project created and connected
- [ ] Environment variables set in Vercel dashboard
- [ ] `VITE_API_BASE_URL=https://your-backend-url.onrender.com`
- [ ] `VITE_ENV=production`
- [ ] `VITE_ENABLE_DEBUG_LOGS=false`
- [ ] Production Google Maps keys configured
- [ ] Deployment successful
- [ ] App loads at `https://your-app.vercel.app`

#### Mobile (EAS/Expo)
- [ ] `eas.json` configured
- [ ] `app.json` extra configured with production URLs
- [ ] EAS build profile set up
- [ ] API base URL points to production backend
- [ ] Google Maps keys for iOS and Android
- [ ] Debug logs disabled in production
- [ ] Build successful for Android
- [ ] Build successful for iOS

### Backend Configuration

#### Local Development
- [ ] `backend/.env.local` file created
- [ ] `NODE_ENV=development`
- [ ] `MONGODB_URI=mongodb://localhost:27017/energeia-dev`
- [ ] `JWT_SECRET` set to a test value
- [ ] `CORS_ORIGIN` includes localhost URLs
- [ ] `npm run dev` starts without errors
- [ ] MongoDB connection successful
- [ ] `/health` endpoint responds
- [ ] All route handlers registered

#### Render Production
- [ ] Render service created
- [ ] GitHub repository connected
- [ ] Environment variables set in Render dashboard
- [ ] `NODE_ENV=production`
- [ ] `MONGODB_URI` points to MongoDB Atlas
- [ ] `JWT_SECRET` is strong and random
- [ ] `CORS_ORIGIN` includes frontend URL
- [ ] Deployment successful
- [ ] Backend health check: `curl https://your-backend.onrender.com/health`
- [ ] Database connection working
- [ ] All routes accessible

### Database Configuration

#### Local Setup
- [ ] MongoDB installed locally OR MongoDB Atlas account created
- [ ] Database connection string correct
- [ ] Connection pool settings appropriate
- [ ] Auto-indexing enabled for development
- [ ] MongoDB Compass can connect
- [ ] Initial data seeded (if applicable)

#### Production Setup
- [ ] MongoDB Atlas cluster created
- [ ] Production database created
- [ ] Database user created with strong password
- [ ] Connection string in backend .env.production
- [ ] IP whitelist configured (0.0.0.0/0 for now)
- [ ] Automatic backups enabled
- [ ] Backup retention configured (7-30 days)
- [ ] Test database restore process

### API Client Configuration

#### Verification
- [ ] `services/config.ts` created and exports correctly
- [ ] `config.api.baseUrl` returns correct URL
- [ ] `config.api.socketUrl` returns correct URL
- [ ] `services/apiClient.ts` imports from config
- [ ] `services/trackingSocket.ts` uses BASE_URL from apiClient
- [ ] Timeout is configurable via environment
- [ ] No hardcoded URLs remain (grep for hardcoded URLs)

#### Tests
- [ ] API request succeeds in local dev
- [ ] Socket connection established in local dev
- [ ] API request succeeds from Vercel
- [ ] Socket connection established from Vercel
- [ ] Error handling works correctly
- [ ] Timeout triggered if backend is slow
- [ ] Authentication tokens passed correctly

### CORS Configuration

#### Local Development
- [ ] Backend accepts `http://localhost:3000`
- [ ] Backend accepts `http://localhost:19006` (Expo web)
- [ ] Backend accepts `http://localhost:19007` (Expo web)
- [ ] Backend accepts `exp://localhost` (Expo mobile)
- [ ] CORS headers present in responses
- [ ] Credentials allowed in CORS

#### Production
- [ ] Backend accepts `https://your-app.vercel.app`
- [ ] Backend accepts `https://yourdomain.com` (if applicable)
- [ ] Backend does NOT accept `http://` in production
- [ ] Backend does NOT accept `localhost` in production
- [ ] Preflight requests handled correctly
- [ ] CORS Origin validation strict

### Environment Variables

#### Never Hardcoded
- [ ] API Base URL
- [ ] Socket URL
- [ ] JWT Secret
- [ ] Database Connection String
- [ ] CORS Origins
- [ ] Google Maps API Keys
- [ ] Stripe Keys
- [ ] Email credentials
- [ ] Any sensitive data

#### .gitignore Configured
- [ ] `.env` not committed
- [ ] `.env.local` not committed
- [ ] `.env.production` not committed
- [ ] `.env.example` IS committed
- [ ] `backend/.env*` not committed
- [ ] `backend/.env.example` IS committed

#### Environment-Specific
- [ ] Development values in .env.local
- [ ] Production values in .env.production
- [ ] Vercel has production values
- [ ] Render has production values
- [ ] EAS has production values
- [ ] No cross-environment value mistakes

### Logging Configuration

#### Development
- [ ] `VITE_ENABLE_DEBUG_LOGS=true` in local
- [ ] `ENABLE_DEBUG_LOGS=true` in backend local
- [ ] Detailed logs visible in console
- [ ] Database query logs appear
- [ ] API request/response logs appear

#### Production
- [ ] `VITE_ENABLE_DEBUG_LOGS=false` in production
- [ ] `ENABLE_DEBUG_LOGS=false` in backend production
- [ ] Only important logs in production
- [ ] No sensitive data in logs
- [ ] Error tracking configured (Sentry/similar)

### Security Verification

#### Secrets Management
- [ ] JWT secret is strong (generated with openssl)
- [ ] JWT secret different per environment
- [ ] Database credentials strong
- [ ] No credentials in code
- [ ] No credentials in Git history
- [ ] Rotate secrets periodically

#### HTTPS/SSL
- [ ] Backend uses HTTPS in production
- [ ] Frontend uses HTTPS in production
- [ ] Certificate valid and not expired
- [ ] No mixed HTTP/HTTPS content
- [ ] Secure headers configured

#### Rate Limiting
- [ ] Rate limiting configured in backend
- [ ] Enabled in production only
- [ ] Configured per IP/user
- [ ] Appropriate limits set

### Testing Checklist

#### API Connectivity
- [ ] [ ] Can create user account
- [ ] [ ] Can log in
- [ ] [ ] Can fetch user profile
- [ ] [ ] Can upload files
- [ ] [ ] Can create charging booking
- [ ] [ ] Can update profile
- [ ] [ ] Can delete data

#### Real-Time Features
- [ ] [ ] WebSocket connects successfully
- [ ] [ ] Receives vehicle location updates
- [ ] [ ] Receives charging status updates
- [ ] [ ] Receives notifications

#### Error Scenarios
- [ ] [ ] Backend offline shows error
- [ ] [ ] Invalid credentials rejected
- [ ] [ ] Invalid tokens handled
- [ ] [ ] Timeout after 30 seconds
- [ ] [ ] Network errors handled gracefully

#### Cross-Environment
- [ ] [ ] Local dev → local backend works
- [ ] [ ] Local dev → production backend works
- [ ] [ ] Vercel → production backend works
- [ ] [ ] Mobile → production backend works
- [ ] [ ] All environments handle errors

### Performance Verification

#### Frontend
- [ ] [ ] Page loads < 3 seconds
- [ ] [ ] API response < 1 second
- [ ] [ ] No console errors
- [ ] [ ] No memory leaks
- [ ] [ ] No 404s for assets

#### Backend
- [ ] [ ] Health check responds < 100ms
- [ ] [ ] API endpoint responds < 500ms
- [ ] [ ] Database queries optimized
- [ ] [ ] Connection pool configured
- [ ] [ ] No N+1 queries

### Monitoring Setup

#### Alerts
- [ ] [ ] Backend uptime monitoring configured
- [ ] [ ] Error rate monitoring configured
- [ ] [ ] Database monitoring configured
- [ ] [ ] Alert notifications configured

#### Logging
- [ ] [ ] Error logs centralized
- [ ] [ ] Structured logging implemented
- [ ] [ ] Log retention configured
- [ ] [ ] Log search/analysis available

## Post-Deployment Checklist

### Immediate After Deploy
- [ ] [ ] Backend health check passes
- [ ] [ ] Frontend loads without errors
- [ ] [ ] Can complete login flow
- [ ] [ ] Can perform main features
- [ ] [ ] No CORS errors in console
- [ ] [ ] No 500 errors in backend logs

### 24 Hour After Deploy
- [ ] [ ] No spike in error rates
- [ ] [ ] Performance metrics normal
- [ ] [ ] Database performing well
- [ ] [ ] No resource warnings
- [ ] [ ] User reports minimal issues

### Ongoing
- [ ] [ ] Daily log review
- [ ] [ ] Weekly performance review
- [ ] [ ] Monthly security audit
- [ ] [ ] Quarterly backup test
- [ ] [ ] Yearly penetration test

## Quick Reference Commands

### Check Backend Status
```bash
# Local
curl http://localhost:5001/health

# Production
curl https://your-backend.onrender.com/health
```

### View Backend Logs
```bash
# Local
tail -f logs/backend.log

# Render
Visit dashboard and click "Logs"
```

### Verify Environment Variables

Frontend:
```bash
npm run env  # Lists environment variables
```

Backend:
```bash
node -e "console.log(require('./config/env'))"
```

### Test Socket Connection
```bash
# From browser console
io('http://localhost:5001', {
  transports: ['websocket']
}).on('connect', () => console.log('Connected!'))
```

### Generate JWT Secret
```bash
openssl rand -base64 32
```

## Files Modified Summary

### Created
- `/services/config.ts` - Environment configuration service
- `/backend/config/env.js` - Backend configuration service
- `/.env.example` - Frontend environment template
- `/.env.local` - Frontend local dev variables
- `/.env.production` - Frontend production variables
- `/backend/.env.example` - Backend environment template
- `/backend/.env.local` - Backend local dev variables
- `/backend/.env.production` - Backend production variables
- `/SETUP_LOCAL.md` - Local development guide
- `/SETUP_RENDER.md` - Render deployment guide
- `/SETUP_VERCEL.md` - Vercel deployment guide

### Modified
- `/services/apiClient.ts` - Uses config for base URL
- `/app.json` - Added environment variables in extra
- `/backend/server.js` - Uses appConfig for CORS and port
- `/backend/config/db.js` - Uses appConfig for database
- `/.gitignore` - Added .env file patterns

## Support & Troubleshooting

### Common Issues

1. **"API_BASE_URL is not configured"**
   - Check .env.local exists
   - Check VITE_API_BASE_URL is set
   - Restart dev server

2. **CORS errors from frontend**
   - Check CORS_ORIGIN in backend .env
   - Verify frontend URL is in CORS list
   - Redeploy backend after changes

3. **WebSocket connection failed**
   - Check VITE_SOCKET_URL matches API URL
   - Ensure backend supports WebSocket
   - Check firewall allows WebSocket

4. **Database connection timeout**
   - Verify MongoDB is running (local)
   - Check connection string is correct
   - Check IP whitelist (Atlas)

5. **JWT secret not working**
   - Ensure JWT_SECRET is set
   - Don't use quotes around secret in .env
   - Restart backend after changing

### Getting Help

1. Check logs for detailed error messages
2. Review the setup guide for your environment
3. Test individual components (health check, etc)
4. Verify all environment variables are set
5. Check GitHub issues/documentation

## Conclusion

This checklist ensures:
✅ No localhost URLs in production
✅ All environment variables configured correctly
✅ Secure credentials management
✅ Proper error handling
✅ Successful deployments
✅ Good monitoring and logging

Follow this checklist before deploying to ensure a smooth launch!
