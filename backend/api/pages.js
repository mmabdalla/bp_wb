import express from 'express';
// BOSA SDK instance (initialized in server.js)
let bosa = null;
export const initPagesAPI = (bosaInstance) => {
    bosa = bosaInstance;
};
export const createPagesRouter = () => {
    const router = express.Router();
    router.post('/', async (req, res) => {
        try {
            const { app_name, route_path, page_config } = req.body;
            if (!app_name || !route_path || !page_config) {
                bosa?.log?.warn('CreatePage: Missing required fields');
                return res.status(400).json({ error: 'Missing required fields' });
            }
            if (!bosa) {
                return res.status(500).json({ error: 'BOSA SDK not initialized' });
            }
            // Check if page already exists
            const existing = await bosa.db
                .query('wb_pages')
                .where('app_name', '=', app_name)
                .where('route_path', '=', route_path)
                .first();
            if (existing) {
                bosa.log?.warn(`CreatePage: Page already exists | App: ${app_name} | Route: ${route_path}`);
                return res.status(409).json({ error: 'Page already exists' });
            }
            // Insert using BOSA SDK
            const id = await bosa.db.query('wb_pages').insert({
                app_name,
                route_path,
                page_config: JSON.stringify(page_config),
                version: 1,
            });
            bosa.log?.info(`CreatePage: Page created | ID: ${id} | App: ${app_name}`);
            res.status(201).json({
                id,
                app_name,
                route_path,
                page_config,
                version: 1,
            });
        }
        catch (error) {
            bosa?.log?.error(`CreatePage: Failed | Error: ${error.message} | App: ${req.body.app_name}`);
            res.status(500).json({ error: error.message });
        }
    });
    router.get('/:id', async (req, res) => {
        try {
            if (!bosa) {
                return res.status(500).json({ error: 'BOSA SDK not initialized' });
            }
            const page = await bosa.db
                .query('wb_pages')
                .where('id', '=', Number(req.params.id))
                .first();
            if (!page) {
                bosa.log?.warn(`GetPage: Page not found | ID: ${req.params.id}`);
                return res.status(404).json({ error: 'Page not found' });
            }
            const result = page;
            res.json({
                ...result,
                page_config: JSON.parse(result.page_config),
            });
        }
        catch (error) {
            bosa?.log?.error(`GetPage: Failed | ID: ${req.params.id} | Error: ${error.message}`);
            res.status(500).json({ error: error.message });
        }
    });
    router.put('/:id', async (req, res) => {
        try {
            if (!bosa) {
                return res.status(500).json({ error: 'BOSA SDK not initialized' });
            }
            const { page_config } = req.body;
            if (!page_config) {
                bosa.log?.warn(`UpdatePage: Missing page_config | ID: ${req.params.id}`);
                return res.status(400).json({ error: 'Missing page_config' });
            }
            const existing = await bosa.db
                .query('wb_pages')
                .where('id', '=', Number(req.params.id))
                .first();
            if (!existing) {
                bosa.log?.warn(`UpdatePage: Page not found | ID: ${req.params.id}`);
                return res.status(404).json({ error: 'Page not found' });
            }
            const newVersion = (existing.version || 1) + 1;
            await bosa.db
                .query('wb_pages')
                .where('id', '=', Number(req.params.id))
                .update({
                page_config: JSON.stringify(page_config),
                version: newVersion,
            });
            bosa.log?.info(`UpdatePage: Page updated | ID: ${req.params.id} | Version: ${newVersion}`);
            res.json({
                id: Number(req.params.id),
                page_config,
                version: newVersion,
            });
        }
        catch (error) {
            bosa?.log?.error(`UpdatePage: Failed | ID: ${req.params.id} | Error: ${error.message}`);
            res.status(500).json({ error: error.message });
        }
    });
    router.delete('/:id', async (req, res) => {
        try {
            if (!bosa) {
                return res.status(500).json({ error: 'BOSA SDK not initialized' });
            }
            const deleted = await bosa.db
                .query('wb_pages')
                .where('id', '=', Number(req.params.id))
                .delete();
            if (deleted === 0) {
                bosa.log?.warn(`DeletePage: Page not found | ID: ${req.params.id}`);
                return res.status(404).json({ error: 'Page not found' });
            }
            bosa.log?.info(`DeletePage: Page deleted | ID: ${req.params.id}`);
            res.status(204).send();
        }
        catch (error) {
            bosa?.log?.error(`DeletePage: Failed | ID: ${req.params.id} | Error: ${error.message}`);
            res.status(500).json({ error: error.message });
        }
    });
    router.get('/', async (req, res) => {
        try {
            if (!bosa) {
                return res.status(500).json({ error: 'BOSA SDK not initialized' });
            }
            const appName = req.query.app_name;
            let query = bosa.db.query('wb_pages');
            if (appName) {
                query = query.where('app_name', '=', appName);
            }
            const pages = await query.get();
            const results = pages.map((page) => ({
                ...page,
                page_config: JSON.parse(page.page_config),
            }));
            res.json(results);
        }
        catch (error) {
            bosa?.log?.error(`ListPages: Failed | App: ${req.query.app_name} | Error: ${error.message}`);
            res.status(500).json({ error: error.message });
        }
    });
    return router;
};
