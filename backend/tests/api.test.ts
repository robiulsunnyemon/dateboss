import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../src/server';

describe('TheDateBoss Backend API', () => {
  it('GET /api/health returns service status and integrations', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.realtime).toBe('Socket.io enabled');
    expect(res.body.integrations).toHaveProperty('cloudinary');
    expect(res.body.integrations).toHaveProperty('stripe');
  });

  it('POST /api/auth/register rejects invalid email via Zod validation', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'not-an-email',
      password: '123',
    });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/auth/register rejects ADMIN role in public registration', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'hacker@example.com',
      password: 'password123',
      role: 'ADMIN',
    });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/admin/metrics requires authentication token', async () => {
    const res = await request(app).get('/api/admin/metrics');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/messages/conversations requires authentication token', async () => {
    const res = await request(app).get('/api/messages/conversations');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('Unknown routes return structured 404 JSON', async () => {
    const res = await request(app).get('/api/does-not-exist');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
