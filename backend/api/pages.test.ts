// WB-006: Page Config Storage - Tests First (TDD)
import { describe, it, expect, beforeEach } from '@jest/globals';
import { initPagesAPI, createPagesRouter } from './pages';
import express from 'express';
import request from 'supertest';

describe('Page Config Storage API', () => {
  let app: express.Application;
  let mockBosa: any;

  beforeEach(() => {
    // Mock BOSA SDK with proper query builder chain
    const mockData: any[] = [];
    let nextId = 1;

    mockBosa = {
      init: async () => Promise.resolve(),
      log: {
        info: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
      },
      db: {
        query: (table: string) => {
          const createQueryBuilder = (conditions: any[] = []) => {
            const builder: any = {
              where: (col: string, op: string, val: any) => {
                return createQueryBuilder([...conditions, { col, op, val }]);
              },
              first: async () => {
                let results = [...mockData];
                conditions.forEach((cond) => {
                  results = results.filter((item) => item[cond.col] === cond.val);
                });
                return results[0] || null;
              },
              get: async () => {
                let results = [...mockData];
                conditions.forEach((cond) => {
                  results = results.filter((item) => item[cond.col] === cond.val);
                });
                return results;
              },
              update: async (data: any) => {
                let results = [...mockData];
                conditions.forEach((cond) => {
                  results = results.filter((item) => item[cond.col] === cond.val);
                });
                results.forEach((item) => {
                  Object.assign(item, data);
                });
              },
              delete: async () => {
                let indices: number[] = [];
                mockData.forEach((item, idx) => {
                  let matches = true;
                  conditions.forEach((cond) => {
                    if (item[cond.col] !== cond.val) matches = false;
                  });
                  if (matches) indices.push(idx);
                });
                indices.reverse().forEach((idx) => mockData.splice(idx, 1));
                return indices.length;
              },
              insert: async (data: any) => {
                const id = nextId++;
                const newItem = { ...data, id };
                mockData.push(newItem);
                return id;
              },
            };
            return builder;
          };
          return createQueryBuilder();
        },
      },
    };

    // Clear mock data before each test
    mockData.length = 0;
    nextId = 1;

    initPagesAPI(mockBosa);
    app = express();
    app.use(express.json());
    app.use('/api/pages', createPagesRouter());
  });

  describe('POST /api/pages', () => {
    it('should create a new page with valid config', async () => {
      const response = await request(app)
        .post('/api/pages')
        .send({
          app_name: 'test-app',
          route_path: '/home',
          page_config: { components: [] },
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.app_name).toBe('test-app');
      expect(response.body.route_path).toBe('/home');
    });

    it('should reject invalid page config', async () => {
      const response = await request(app).post('/api/pages').send({
        app_name: 'test-app',
        // missing route_path and page_config
      });

      expect(response.status).toBe(400);
    });

    it('should enforce unique app_name and route_path combination', async () => {
      await request(app).post('/api/pages').send({
        app_name: 'test-app',
        route_path: '/home',
        page_config: { components: [] },
      });

      const response = await request(app).post('/api/pages').send({
        app_name: 'test-app',
        route_path: '/home',
        page_config: { components: [] },
      });

      expect(response.status).toBe(409);
    });
  });

  describe('GET /api/pages/:id', () => {
    it('should retrieve page by id', async () => {
      const createRes = await request(app).post('/api/pages').send({
        app_name: 'test-app',
        route_path: '/home',
        page_config: { components: [] },
      });

      const response = await request(app).get(
        `/api/pages/${createRes.body.id}`
      );

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(createRes.body.id);
    });

    it('should return 404 for non-existent page', async () => {
      const response = await request(app).get('/api/pages/999');
      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/pages/:id', () => {
    it('should update existing page config', async () => {
      const createRes = await request(app).post('/api/pages').send({
        app_name: 'test-app',
        route_path: '/home',
        page_config: { components: [] },
      });

      const response = await request(app)
        .put(`/api/pages/${createRes.body.id}`)
        .send({
          page_config: { components: [{ type: 'Button' }] },
        });

      expect(response.status).toBe(200);
      expect(response.body.page_config.components).toHaveLength(1);
    });

    it('should increment version on update', async () => {
      const createRes = await request(app).post('/api/pages').send({
        app_name: 'test-app',
        route_path: '/home',
        page_config: { components: [] },
      });

      const response = await request(app)
        .put(`/api/pages/${createRes.body.id}`)
        .send({
          page_config: { components: [] },
        });

      expect(response.body.version).toBe(2);
    });
  });

  describe('DELETE /api/pages/:id', () => {
    it('should delete page by id', async () => {
      const createRes = await request(app).post('/api/pages').send({
        app_name: 'test-app',
        route_path: '/home',
        page_config: { components: [] },
      });

      const response = await request(app).delete(
        `/api/pages/${createRes.body.id}`
      );

      expect(response.status).toBe(204);
    });
  });

  describe('GET /api/pages', () => {
    it('should list all pages', async () => {
      await request(app).post('/api/pages').send({
        app_name: 'test-app',
        route_path: '/home',
        page_config: { components: [] },
      });

      const response = await request(app).get('/api/pages');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should filter pages by app_name', async () => {
      await request(app).post('/api/pages').send({
        app_name: 'app1',
        route_path: '/home',
        page_config: { components: [] },
      });

      const response = await request(app).get('/api/pages?app_name=app1');

      expect(response.status).toBe(200);
      expect(response.body.every((p: any) => p.app_name === 'app1')).toBe(
        true
      );
    });
  });
});

