// BP_WB - BOSA Plugin Website Builder
// Main entry point for Node.js runtime

// TODO: Add bosa-sdk-node when available
// import { BOSA } from 'bosa-sdk-node';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize BOSA SDK
// TODO: Uncomment when bosa-sdk-node is available
// import { BOSA } from 'bosa-sdk-node';
// const bosa = new BOSA({
//   kernelURL: process.env.BOSA_KERNEL_URL || 'http://localhost:3000',
//   pluginName: process.env.PLUGIN_NAME || 'bp_wb',
//   pluginToken: process.env.BOSA_KERNEL_TOKEN,
// });
// await bosa.init();

// Mock BOSA SDK for development (must match SDK interface)
const bosa = {
  init: async () => Promise.resolve(),
  log: {
    info: (msg) => console.log(`[INFO] ${msg}`),
    error: (msg) => console.error(`[ERROR] ${msg}`),
    warn: (msg) => console.warn(`[WARN] ${msg}`),
  },
  db: {
    query: (table) => ({
      where: (col, op, val) => ({
        where: (col2, op2, val2) => ({
          first: async () => null,
          get: async () => [],
          update: async () => {},
          delete: async () => 0,
        }),
        first: async () => null,
        get: async () => [],
        update: async () => {},
        delete: async () => 0,
      }),
      insert: async (data) => Math.floor(Math.random() * 1000),
      get: async () => [],
    }),
  },
};

// Initialize BOSA SDK first
(async () => {
  await bosa.init();
})();

// Initialize Express app
const app = express();
const port = process.env.PLUGIN_PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', plugin: 'bp_wb' });
});

// Initialize pages API with BOSA SDK
import { initPagesAPI, createPagesRouter } from './backend/api/pages.js';

// Initialize pages API
initPagesAPI(bosa);

// Route handlers
app.get('/', serveEditor);
app.get('/editor', serveEditor);
app.use('/api/pages', createPagesRouter());
app.get('/preview/:id', previewPage);

// Serve static assets (Vite build outputs)
// BOSA forwards /bp_wb/assets/* to this plugin, Express receives /assets/*
// The base path in Vite config ensures assets are referenced as /bp_wb/assets/*
app.use('/assets', express.static(path.join(__dirname, 'dist', 'assets')));

// Handler function for manifest route (BOSA calls this)
async function serveAssets(req, res) {
  const filepath = req.params.filepath || req.path.replace('/assets/', '');
  const assetPath = path.join(__dirname, 'dist', 'assets', filepath);
  res.sendFile(assetPath, (err) => {
    if (err) {
      bosa.log?.error(`Failed to serve asset: ${filepath} | Error: ${err.message}`);
      res.status(404).json({ error: 'Asset not found' });
    }
  });
}

async function serveEditor(req, res) {
  const indexPath = path.join(__dirname, 'dist', 'frontend', 'index.html');
  res.sendFile(indexPath);
}

async function previewPage(req, res) {
  try {
    const pageId = req.params.id;
    
    if (!bosa) {
      bosa.log?.error('PreviewPage: BOSA SDK not initialized');
      return res.status(500).json({ error: 'Server not initialized' });
    }

    // Load page config using BOSA SDK
    const page = await bosa.db
      .query('wb_pages')
      .where('id', '=', Number(pageId))
      .first();

    if (!page) {
      bosa.log?.warn(`PreviewPage: Page not found | ID: ${pageId}`);
      return res.status(404).json({ error: 'Page not found' });
    }

    const pageConfig = JSON.parse(page.page_config);
    
    // Render preview HTML with LayoutEngine
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview - Page ${pageId}</title>
  <style>
    body { margin: 0; padding: 20px; font-family: system-ui, -apple-system, sans-serif; }
    .preview-container { max-width: 1200px; margin: 0 auto; }
  </style>
</head>
<body>
  <div class="preview-container" id="root"></div>
  <script>
    window.__PAGE_CONFIG__ = ${JSON.stringify(pageConfig)};
  </script>
  <script type="module" src="/bp_wb/renderer.js"></script>
</body>
</html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (error) {
    bosa.log?.error(`PreviewPage failed | Page ID: ${req.params.id} | Error: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Initialize BOSA and start server
async function init() {
  try {
    await bosa.init();
    bosa.log.info('BP_WB plugin initialized successfully');
    
    app.listen(port, () => {
      bosa.log.info(`BP_WB plugin server running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to initialize BP_WB plugin:', error);
    process.exit(1);
  }
}

init();

