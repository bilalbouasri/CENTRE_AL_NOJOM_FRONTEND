# Vercel Deployment Guide

## Environment Variables Setup

### Required Environment Variables

For Vercel deployment, you need to set the following environment variables in your Vercel project settings:

1. **VITE_API_BASE_URL** - Your production backend API URL
   - Example: `https://your-backend-domain.com/api`

2. **VITE_APP_NAME** - Application name
   - Example: `Centre Al Nojom`

### How to Set Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable with the exact names above
4. For production deployment, add them to **Production** environment

### Local Development

For local development, create a `.env.local` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=Centre Al Nojom
```

## Deployment Steps

### 1. Connect Repository to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Import your GitHub repository: `bilalbouasri/CENTRE_AL_NOJOM_FRONTEND`
4. Vercel will automatically detect it's a Vite/React project

### 2. Configure Environment Variables

1. In your Vercel project dashboard, go to **Settings** → **Environment Variables**
2. Add the required variables:
   - `VITE_API_BASE_URL` - Your production API URL
   - `VITE_APP_NAME` - "Centre Al Nojom"

### 3. Deploy

1. Vercel will automatically deploy when you push to the repository
2. Or manually trigger a deployment from the dashboard

## Configuration Files

### vercel.json
This file contains the Vercel deployment configuration:

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "build": {
    "env": {
      "VITE_API_BASE_URL": "@vite_api_base_url",
      "VITE_APP_NAME": "Centre Al Nojom"
    }
  }
}
```

## Troubleshooting

### Build Fails
- Check that all environment variables are set correctly
- Verify the API URL is accessible
- Check the build logs in Vercel dashboard

### Environment Variables Not Working
- Ensure variable names start with `VITE_` for Vite applications
- Restart the deployment after adding new variables
- Check that variables are added to the correct environment (Production/Preview)

### CORS Issues
- Make sure your backend allows requests from your Vercel domain
- Configure CORS in your Laravel backend to include your Vercel URL

## Production Checklist

- [ ] Environment variables configured in Vercel
- [ ] API endpoints accessible from Vercel domain
- [ ] CORS configured on backend
- [ ] Build completes successfully
- [ ] Application loads without console errors