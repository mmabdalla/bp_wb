# UI Testing Guide for BP_WB

This guide explains how to test the BP_WB Website Builder UI during development.

## Prerequisites

- Node.js installed
- Dependencies installed: `npm install`

## Development Setup

### Option 1: Run Both Servers Separately (Recommended for Development)

**Terminal 1 - Backend Server:**
```powershell
npm run dev
```
This starts the Express backend server on `http://localhost:3001`

**Terminal 2 - Frontend Dev Server:**
```powershell
npm run dev:frontend
```
This starts the Vite dev server on `http://localhost:5173` with hot module replacement (HMR)

**Access the UI:**
- Open your browser to: `http://localhost:5173`
- The Vite dev server automatically proxies `/api/*` requests to the backend on port 3001

### Option 2: Run Both Servers Together (Requires `concurrently`)

**Install concurrently (if not already installed):**
```powershell
npm install --save-dev concurrently
```

**Run both servers:**
```powershell
npm run dev:all
```

This runs both the backend and frontend servers simultaneously.

## Testing the UI

### 1. Editor Interface

Navigate to: `http://localhost:5173/` or `http://localhost:5173/editor`

You should see:
- **Toolbar** - Top bar with save, preview, undo/redo buttons
- **Sidebar** - Component palette on the left
- **Canvas** - Main editing area in the center
- **Property Panel** - Right sidebar for editing component properties

### 2. Component Palette

- Click components in the left sidebar to add them to the canvas
- Components are organized by category (Base, Layout, Forms, etc.)

### 3. Drag and Drop

- Drag components from the palette onto the canvas
- Drag components within the canvas to reorder them
- Drop zones will highlight when dragging

### 4. Property Panel

- Click on any component in the canvas
- The right sidebar shows editable properties
- Changes update in real-time on the canvas

### 5. API Testing

The frontend automatically proxies API requests:
- `GET /api/pages` - List all pages
- `POST /api/pages` - Create a new page
- `GET /api/pages/:id` - Get a specific page
- `PUT /api/pages/:id` - Update a page
- `DELETE /api/pages/:id` - Delete a page

### 6. Preview Mode

Navigate to: `http://localhost:5173/preview/:id` (where `:id` is a page ID)

This shows the rendered page as it would appear to end users.

## Hot Module Replacement (HMR)

The Vite dev server supports hot module replacement:
- Changes to React components update instantly without page refresh
- State is preserved during updates
- Fast refresh for React components

## Troubleshooting

### Port Already in Use

If port 3001 or 5173 is already in use:

**Backend (port 3001):**
```powershell
$env:PLUGIN_PORT=3002; npm run dev
```

**Frontend (port 5173):**
Edit `vite.config.js` and change the `server.port` value.

### API Requests Failing

1. Ensure the backend server is running on port 3001
2. Check the proxy configuration in `vite.config.js`
3. Check browser console for CORS errors
4. Verify the backend API routes are working: `curl http://localhost:3001/api/pages`

### Components Not Rendering

1. Check browser console for errors
2. Verify all dependencies are installed: `npm install`
3. Check that TypeScript compilation is successful: `npm run build`
4. Clear browser cache and hard refresh (Ctrl+Shift+R)

### Build Errors

If you see TypeScript or build errors:
```powershell
# Check for TypeScript errors
npx tsc --noEmit

# Check for linting errors
npm run lint
```

## Production Build

To build for production:
```powershell
npm run build
```

This creates a `dist/` folder with optimized production files. The backend server (`server.js`) automatically serves these files when running in production mode.

## Testing with BOSA Kernel

When testing as a BOSA plugin:

1. **Install the plugin in BOSA:**
   ```bash
   bosa plugin install ./path/to/bp_wb
   ```

2. **Access via BOSA routes:**
   - Editor: `http://localhost:3000/bp_wb/` or `http://localhost:3000/bp_wb/editor`
   - API: `http://localhost:3000/api/bp_wb/pages`

3. **Environment Variables:**
   BOSA automatically sets:
   - `BOSA_KERNEL_URL` - BOSA kernel URL
   - `PLUGIN_NAME` - Plugin name (bp_wb)
   - `BOSA_KERNEL_TOKEN` - Plugin authentication token
   - `PLUGIN_PORT` - Port assigned to the plugin

## Browser DevTools

Use browser DevTools for debugging:
- **Console** - View logs and errors
- **Network** - Monitor API requests
- **React DevTools** - Inspect React component tree
- **Elements** - Inspect DOM structure

## Next Steps

- See `docs/BP_WB_DEVELOPMENT_ROADMAP.md` for feature roadmap
- See `docs/BP_WB_LINEAR_ISSUES.md` for detailed issue list
- See `docs/DEVELOPER_GUIDE.md` for BOSA plugin development guide

