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

// Placeholder route handlers
async function serveEditor(req, res) {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
}

async function previewPage(req, res) {
  try {
    // TODO: Implement in WB-007
    res.status(501).json({ error: 'Not implemented yet' });
  } catch (error) {
    bosa.log.error(`PreviewPage failed | Page ID: ${req.params.id} | Error: ${error.message}`);
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

