# Homestaq Node Service - cPanel Deployment Guide

## Files Ready for Upload

- `homestaq-node-service-cpanel-v2.zip` - Contains your app with memory-optimized configuration
- `homestaq-node-service-cpanel.zip` - Original version (use v2 if you get memory errors)

## Step-by-Step cPanel Deployment

### 1. Upload Files to cPanel

1. Log into cPanel
2. Open **File Manager**
3. Navigate to `/home/ktniuvps/api.homestaq.com/`
4. Delete any existing files (keep .htaccess if it exists)
5. Upload `homestaq-node-service-cpanel.zip`
6. Right-click the ZIP file and select **Extract**
7. Delete the ZIP file after extraction

### 2. Set Up Node.js Application

1. In cPanel, go to **Setup Node.js App**
2. Click **Create Application**
3. Configure:
   - **Node.js version**: **16.x** (recommended for shared hosting) or 18.x
   - **Application mode**: Production
   - **Application root**: `api.homestaq.com`
   - **Application URL**: `api.homestaq.com`
   - **Application startup file**: `index.js`
4. Click **Create**

💡 **Memory Tip**: If you get memory errors, try Node.js 16.x instead of 18.x/20.x

### 3. Install Dependencies

⚠️ **If you get memory errors during npm install, try these alternatives:**

**Option A: Use the NPM Install button (try this first)**

1. In the Node.js App page, click **Run NPM Install**
2. Wait for it to complete

**Option B: If you get memory errors, use Terminal with memory limits**

1. In cPanel, open **Terminal**
2. Run these commands one by one:
   ```bash
   cd ~/api.homestaq.com
   export NODE_OPTIONS="--max_old_space_size=512"
   npm install --production --no-optional
   ```

**Option C: If still failing, install dependencies one by one**

1. In Terminal, run:
   ```bash
   cd ~/api.homestaq.com
   npm install express --production --no-optional
   npm install dotenv --production --no-optional
   npm install nodemailer --production --no-optional
   ```

### 4. Set Environment Variables (if needed)

If your app needs environment variables:

1. In the Node.js App page, scroll to **Environment variables**
2. Add any variables your email service needs (SMTP settings, etc.)

### 5. Start the Application

1. Click **Start App** (or **Restart App**)
2. Wait for status to show **Running**

### 6. Test Your Application

Visit `https://api.homestaq.com`

You should see:

```json
{
  "message": "Homestaq Node Service is running.",
  "status": "OK",
  "timestamp": "2025-09-03T..."
}
```

## API Endpoints

- `GET /` - Health check
- `POST /api/email/waitlist` - Your email endpoint (based on your routes)

## Troubleshooting

### If you get "Fatal process out of memory" error:

This happens on shared hosting with limited memory. Try these solutions:

1. **Switch to a lower Node.js version**: Use Node.js 16.x instead of 18.x or 20.x
2. **Use memory-limited npm install** (see Step 3, Option B above)
3. **Install dependencies manually** (see Step 3, Option C above)
4. **Contact your hosting provider** to increase memory limits for Node.js apps

### If you see "Index of /" page:

- Node.js app is not running
- Check logs in Node.js App page
- Ensure Application Root and Startup File are correct

### If you see NPM Install errors:

- Check that package.json exists in the root
- Verify all dependencies are listed correctly
- Try the alternative installation methods above

### If app starts but gives errors:

- Check logs in Node.js App page
- Common issues:
  - Missing environment variables
  - Path issues with file references
  - Database connection errors

## Important Notes

- Your app now responds with JSON instead of plain text for better API compatibility
- Environment file loading is now optional (won't crash if .env.local is missing)
- Port is correctly configured for cPanel (uses process.env.PORT)

## Next Steps After Deployment

1. Test all your API endpoints
2. Set up proper environment variables for production
3. Configure any database connections
4. Set up monitoring/logging as needed
