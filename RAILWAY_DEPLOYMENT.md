# Railway Deployment Guide

## Configuration Files

- `railway.json` - Railway-specific configuration
- `nixpacks.toml` - Build process configuration 
- `Procfile` - Process definition
- `serve.json` - Static file serving configuration
- `.env.production` - Production environment variables

## Build Process

1. Railway will use Nixpacks to detect the Node.js project
2. Install dependencies with `npm ci --only=production=false`  
3. Build the React app with `npm run build`
4. Serve static files using `serve` package

## Environment Variables

The app will automatically use Railway's `$PORT` environment variable.

## Deployment Steps

1. Push this branch to your repository
2. Connect repository to Railway
3. Railway will automatically detect the configuration and deploy

The build process creates optimized static files in the `build/` directory and serves them using the `serve` package.