import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/config/prisma';

describe('Events API', () => {
  const TEST_USER_ID = `usr_test_${Date.now()}`;
  const createdEventIds: string[] = [];

  afterAll(async () => {
    if (createdEventIds.length > 0) {
      await prisma.event.deleteMany({
        where: { id: { in: createdEventIds } },
      });
    }
    await prisma.event.deleteMany({
      where: { userId: TEST_USER_ID },
    });
  });

  describe('POST /api/events', () => {
    it('should create an event successfully', async () => {
      const payload = {
        id: `evt_test_${Date.now()}`,
        userId: TEST_USER_ID,
        eventType: 'login',
        payload: { ip: '127.0.0.1' },
        timestamp: new Date().toISOString(),
      };

      const res = await request(app)
        .post('/api/events')
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.eventType).toBe('login');
      expect(res.body.data.userId).toBe(TEST_USER_ID);
      expect(typeof res.body.data.id).toBe('string');

      const generatedId = res.body.data.id;
      createdEventIds.push(generatedId);

      const dbEvent = await prisma.event.findUnique({ where: { id: generatedId } });
      expect(dbEvent).toBeTruthy();
      expect(dbEvent!.userId).toBe(TEST_USER_ID);
    });

    it('should return error for missing required fields', async () => {
      const res = await request(app)
        .post('/api/events')
        .send({ userId: TEST_USER_ID });

      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Event data is invalid');
    });

    it('should return error for invalid timestamp', async () => {
      const res = await request(app)
        .post('/api/events')
        .send({
          id: 'evt_invalid_ts',
          userId: TEST_USER_ID,
          eventType: 'login',
          payload: {},
          timestamp: 'not-a-date',
        });

      expect(res.body.success).toBe(false);
    });

    it('should return error for empty userId', async () => {
      const res = await request(app)
        .post('/api/events')
        .send({
          id: 'evt_empty_uid',
          userId: '',
          eventType: 'login',
          payload: {},
          timestamp: new Date().toISOString(),
        });

      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Event data is invalid');
    });

    it('should return error for empty eventType', async () => {
      const res = await request(app)
        .post('/api/events')
        .send({
          id: 'evt_empty_et',
          userId: TEST_USER_ID,
          eventType: '',
          payload: {},
          timestamp: new Date().toISOString(),
        });

      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Event data is invalid');
    });
  });

  describe('GET /api/events', () => {
    const getTestIds: string[] = [];

    beforeAll(async () => {
      const now = Date.now();
      const ids = [`get_a_${now}`, `get_b_${now}`, `get_c_${now}`];
      getTestIds.push(...ids);
      createdEventIds.push(...ids);

      await prisma.event.createMany({
        data: [
          { id: ids[0], userId: TEST_USER_ID, eventType: 'logout', payload: {}, timestamp: new Date() },
          { id: ids[1], userId: TEST_USER_ID, eventType: 'purchase', payload: { item: 'plan' }, timestamp: new Date(now - 1000) },
          { id: ids[2], userId: TEST_USER_ID, eventType: 'logout', payload: {}, timestamp: new Date(now - 2000) },
        ],
      });
    });

    it('should return events with pagination metadata', async () => {
      const res = await request(app)
        .get('/api/events')
        .query({ page: 1, limit: 2 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.events).toBeInstanceOf(Array);
      expect(res.body.data.events.length).toBeLessThanOrEqual(2);
      expect(res.body.data.pagination).toEqual(
        expect.objectContaining({
          page: 1,
          limit: 2,
          total: expect.any(Number),
          totalPages: expect.any(Number),
        })
      );
    });

    it('should respect limit parameter', async () => {
      const res = await request(app)
        .get('/api/events')
        .query({ page: 1, limit: 1 });

      expect(res.status).toBe(200);
      expect(res.body.data.events.length).toBe(1);
    });

    it('should filter by event_type', async () => {
      const res = await request(app)
        .get('/api/events')
        .query({ event_type: 'logout' });

      expect(res.status).toBe(200);
      const events = res.body.data.events;
      expect(events.length).toBeGreaterThanOrEqual(1);
      expect(events.every((e: { eventType: string }) => e.eventType === 'logout')).toBe(true);
    });

    it('should return empty array when no results match filter', async () => {
      const res = await request(app)
        .get('/api/events')
        .query({ event_type: 'nonexistent_event_type_xyz_999' });

      expect(res.status).toBe(200);
      expect(res.body.data.events).toEqual([]);
      expect(res.body.data.pagination.total).toBe(0);
    });

    it('should filter by date range', async () => {
      const start = new Date(Date.now() - 60_000).toISOString();
      const end = new Date(Date.now() + 60_000).toISOString();

      const res = await request(app)
        .get('/api/events')
        .query({ start_date: start, end_date: end });

      expect(res.status).toBe(200);
      const events = res.body.data.events;
      for (const e of events) {
        const ts = new Date(e.timestamp).getTime();
        expect(ts).toBeGreaterThanOrEqual(new Date(start).getTime());
        expect(ts).toBeLessThanOrEqual(new Date(end).getTime());
      }
    });

    it('should combine event_type filter with date range', async () => {
      const start = new Date(Date.now() - 60_000).toISOString();
      const end = new Date(Date.now() + 60_000).toISOString();

      const res = await request(app)
        .get('/api/events')
        .query({ event_type: 'logout', start_date: start, end_date: end });

      expect(res.status).toBe(200);
      const events = res.body.data.events;
      for (const e of events) {
        expect(e.eventType).toBe('logout');
      }
    });

    it('should return correct event structure', async () => {
      const res = await request(app)
        .get('/api/events')
        .query({ limit: 1 });

      expect(res.status).toBe(200);
      const event = res.body.data.events[0];
      expect(event).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          userId: expect.any(String),
          eventType: expect.any(String),
          payload: expect.any(Object),
          timestamp: expect.any(String),
        })
      );
    });
  });
});
