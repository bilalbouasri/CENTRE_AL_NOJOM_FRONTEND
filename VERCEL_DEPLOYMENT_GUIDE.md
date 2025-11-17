# Vercel Deployment Guide for Centre Al Nojom Frontend

## Quick Setup Steps

### 1. Connect Your Repository to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New..." → "Project"
3. Import your GitHub repository: `bilalbouasri/CENTRE_AL_NOJOM_FRONTEND`
4. Vercel will automatically detect the Vite framework

### 2. Configure Environment Variables
In your Vercel project settings, go to **Settings** → **Environment Variables** and add:

```
VITE_API_BASE_URL=https://your-backend-domain.com/api
VITE_APP_NAME=Centre Al Nojom
```

**Important Notes:**
- Replace `https://your-backend-domain.com/api` with your actual backend API URL
- If your backend is not deployed yet, you can use a placeholder and update it later
- These variables are automatically injected during the build process

### 3. Deploy
1. Vercel will automatically deploy when you push to the `master` branch
2. You can also trigger manual deployments from the Vercel dashboard

## Environment Variables Explained

### Required Variables:
- `VITE_API_BASE_URL`: The base URL for your Laravel backend API
  - Local development: `http://localhost:8000/api`
  - Production: `https://your-production-backend.com/api`

- `VITE_APP_NAME`: The name of your application (displayed in the UI)

### Optional Variables (if needed):
- `VITE_APP_VERSION`: Application version
- `VITE_APP_DESCRIPTION`: Application description

## Deployment Configuration

The project includes a [`vercel.json`](vercel.json:1) file with the following settings:

- **Framework**: Vite (automatically detected)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Routing**: Single Page Application (SPA) configuration with client-side routing

## Troubleshooting

### Common Issues:

1. **Build Fails with TypeScript Errors**
   - The project is configured to allow unused variables in production builds
   - Check the build logs in Vercel for specific error details

2. **API Calls Fail**
   - Ensure `VITE_API_BASE_URL` is correctly set to your backend URL
   - Verify CORS is configured on your backend

3. **Environment Variables Not Working**
   - Make sure variables are prefixed with `VITE_` for Vite to recognize them
   - Restart the deployment after adding new environment variables

### Backend Deployment:
Before deploying the frontend, make sure your Laravel backend is deployed and accessible. You can deploy it to:
- Laravel Forge
- Laravel Vapor
- Any cloud provider that supports PHP/Laravel

## Post-Deployment

1. **Test the Application**
   - Navigate to your Vercel domain
   - Test login functionality
   - Verify API calls are working

2. **Set Up Custom Domain** (Optional)
   - In Vercel dashboard, go to **Settings** → **Domains**
   - Add your custom domain

3. **Configure Environment Variables for Different Environments**
   - You can set different values for Preview and Production environments in Vercel

## Support

If you encounter any issues during deployment:
1. Check the Vercel deployment logs
2. Verify all environment variables are set correctly
3. Ensure your backend API is accessible from the frontend domain