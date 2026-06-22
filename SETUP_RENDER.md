# Backend Deployment on Render.com

## Prerequisites
- Render.com account (create at https://render.com)
- MongoDB Atlas cluster (create at https://www.mongodb.com/cloud/atlas)
- GitHub repository with your code pushed

## Step 1: Set Up MongoDB Atlas

### 1.1 Create MongoDB Atlas Cluster
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up or log in
3. Create a new organization
4. Click "Create" → "Build a Cluster"
5. Choose "Free" tier
6. Select your region (closest to your users)
7. Click "Create Deployment"

### 1.2 Create Database User
1. Go to "Database Access"
2. Click "Add New Database User"
3. Set username and generate password
4. Add privileges to your cluster
5. Save the credentials securely

### 1.3 Add IP Whitelist
1. Go to "Network Access"
2. Click "Add IP Address"
3. Add 0.0.0.0/0 (allows connections from anywhere)
   - This is safe with strong database credentials

### 1.4 Get Connection String
1. Go to "Database" → "Connect"
2. Click "Connect your application"
3. Copy the URI, it looks like:
```
mongodb+srv://username:password@cluster.mongodb.net/energeia-prod?retryWrites=true&w=majority
```
4. Replace `username` and `password` with your credentials
5. Replace `/admin` with `/energeia-prod`

## Step 2: Deploy Backend on Render.com

### 2.1 Connect GitHub Repository
1. Go to https://dashboard.render.com
2. Click "New" → "Web Service"
3. Click "Connect Repository"
4. Authorize Render to access GitHub
5. Select your repository
6. Click "Connect"

### 2.2 Configure Service
Set the following:

**Name**: `energeia-backend`

**Environment**: `Node`

**Region**: Select closest to your users

**Branch**: `main`

**Build Command**:
```bash
npm install
```

**Start Command**:
```bash
npm start
```

**Instance Type**: Free (or Starter if free is unavailable)

### 2.3 Add Environment Variables
Click "Environment" and add all variables from `backend/.env.production`:

```
NODE_ENV=production
PORT=5001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/energeia-prod?retryWrites=true&w=majority
CORS_ORIGIN=https://your-frontend-url.vercel.app,https://yourdomain.com
API_PREFIX=/api
JWT_SECRET=your-super-secret-random-key-generate-with-openssl
JWT_EXPIRATION=7d
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
SMTP_FROM=noreply@energeia.com
ENABLE_DEBUG_LOGS=false
ENABLE_MOCK_DATA=false
ENV=production
```

**Important Variables**:
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `CORS_ORIGIN`: Your frontend URL (add after frontend is deployed)
- `JWT_SECRET`: Generate with: `openssl rand -base64 32`

### 2.4 Deploy
Click "Create Web Service"

Render will:
- Clone your repository
- Install dependencies
- Start the backend

You'll get a URL like: `https://energeia-backend.onrender.com`

### 2.5 Verify Deployment
```bash
curl https://energeia-backend.onrender.com/health
# Should return: {"success": true, "message": "Server is running"}
```

## Step 3: Enable Auto-Deploy
1. Go to your service settings
2. Find "Auto-Deploy"
3. Enable "Auto-Deploy on Push to main"
4. Now every push to main automatically deploys

## Step 4: Monitor Logs
1. Go to your service
2. Click "Logs"
3. Watch for any errors during startup

Common issues in logs:
- `MONGODB_URI is not configured` - Add it to environment variables
- `Port 5001 is already in use` - Render manages this, shouldn't happen
- `CORS origin not allowed` - Add your frontend URL to CORS_ORIGIN

## Step 5: Set Up Cold Start Wake-up (Optional)

Render's free tier goes to sleep after 15 minutes of inactivity. To prevent this:

### Option 1: Use a monitoring service
Services like https://uptimerobot.com can ping your backend every 5 minutes

### Option 2: Upgrade to Paid Tier
- Click "Settings"
- Change instance type to "Starter Pro"
- Monthly charge of ~$7

## Troubleshooting

### Backend won't start
1. Check logs in Render dashboard
2. Verify all required environment variables are set
3. Check MongoDB connection string is correct

### 502 Bad Gateway
1. Backend might be restarting
2. Check logs for errors
3. Try accessing /health endpoint
4. Wait a few moments for cold start

### CORS errors from frontend
1. Add your frontend domain to CORS_ORIGIN
2. Redeploy backend (change a variable, save, deploy)

### Database connection timeout
1. Check MongoDB Atlas IP whitelist (should be 0.0.0.0/0)
2. Verify connection string format
3. Test connection with MongoDB Compass locally

## Security Best Practices

1. **Never commit .env.local or .env files**
   - Use .env.example for template

2. **Use strong JWT secret**
   - Generate with: `openssl rand -base64 32`

3. **Restrict MongoDB IP whitelist in production**
   - Currently set to 0.0.0.0/0 for ease
   - In production, use only Render's IP ranges

4. **Use SendGrid or similar for emails**
   - Don't use Gmail credentials in production

5. **Rotate JWT secret periodically**
   - Update in Render environment variables
   - Existing tokens will become invalid

6. **Enable SSL/HTTPS**
   - Render provides free SSL
   - Use https://your-backend-url in frontend

## Next Steps
1. Deploy frontend (see SETUP_VERCEL.md)
2. Update CORS_ORIGIN with frontend URL
3. Test API calls from frontend
4. Set up monitoring and alerts
