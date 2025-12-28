# BP_WB Deployment Guide

This guide explains how to deploy the BP_WB Website Builder app to BOSA.

## Quick Deployment

Run the deployment script from the project root:

```powershell
.\scripts\deploy_wb.bat
```

Or from the scripts directory:

```powershell
cd scripts
.\deploy_wb.bat
```

## What the Deployment Script Does

1. **Builds the frontend** - Runs `npm run build:frontend` to create production build
2. **Copies files** to `D:\dev\projects\BOSA\apps\bp_wb\`:
   - `manifest.yaml` - App manifest
   - `server.js` - Node.js server entry point
   - `package.json` - Dependencies
   - `backend/` - Backend API code
   - `migrations/` - Database migrations
   - `dist/` - Built frontend (React app)
   - `docs/` - Documentation
   - `version.txt` - Version information
3. **Creates sidebar configuration** - Creates `sidebar.json` for Super Admin link
4. **Installs dependencies** - Runs `npm install --production` in target directory

## Sidebar Link Configuration

The app is configured to appear in the BOSA sidebar for Super Admin users only, positioned after the "Themes" link.

**Configuration in `manifest.yaml`:**
```yaml
sidebar:
  label: Theme Builder
  url: /bp_wb/
  icon: pencil-square
  role: super_admin
  position: after
  after: themes
```

**Configuration in `sidebar.json` (created by deployment script):**
```json
{
  "sidebar": {
    "links": [
      {
        "label": "Theme Builder",
        "url": "/bp_wb/",
        "icon": "pencil-square",
        "role": "super_admin",
        "position": "after",
        "after": "themes"
      }
    ]
  }
}
```

## Post-Deployment Steps

1. **Restart BOSA Server:**
   ```powershell
   # Stop BOSA server (Ctrl+C)
   # Then restart
   cd D:\dev\projects\BOSA
   bosa serve
   ```

2. **Verify Installation:**
   - Check BOSA logs for app loading
   - Access the app: `http://localhost:3000/bp_wb/`
   - Verify sidebar link appears for Super Admin users

3. **Check App Status:**
   ```powershell
   bosa ps
   ```
   Should show `bp_wb` in the list of running apps.

## Manual Deployment

If you prefer to deploy manually:

1. **Build frontend:**
   ```powershell
   npm run build:frontend
   ```

2. **Copy files to BOSA apps directory:**
   ```powershell
   xcopy /E /I /Y "D:\dev\projects\BOSA Plugins\wb\*" "D:\dev\projects\BOSA\apps\bp_wb\"
   ```

3. **Exclude development files:**
   - Don't copy `node_modules/`
   - Don't copy `.git/`
   - Don't copy `*.test.ts` or `*.test.tsx`
   - Don't copy development config files

4. **Install dependencies:**
   ```powershell
   cd D:\dev\projects\BOSA\apps\bp_wb
   npm install --production
   ```

## Troubleshooting

### App Not Loading

1. Check BOSA logs for errors
2. Verify `manifest.yaml` is valid YAML
3. Check that `server.js` exists and is executable
4. Verify Node.js is installed and in PATH

### Sidebar Link Not Appearing

1. Verify you're logged in as Super Admin
2. Check that `sidebar.json` exists in app directory
3. Verify BOSA is reading sidebar configuration from apps
4. Check browser console for errors

### API Routes Not Working

1. Verify backend server is running (check `bosa ps`)
2. Check that BOSA SDK is properly initialized
3. Verify database migrations have run
4. Check BOSA logs for API errors

## Production Deployment

For production deployment:

1. Update paths in `deploy_wb.bat` to match production paths
2. Ensure production build is optimized:
   ```powershell
   npm run build
   ```
3. Copy to production BOSA instance
4. Restart BOSA server
5. Verify app is accessible

## Updating the App

To update an existing deployment:

1. Make changes in development directory
2. Run deployment script again (it will overwrite existing files)
3. Restart BOSA server to load changes

**Note:** For Node.js apps, you may need to restart the app process or the entire BOSA server for changes to take effect.

