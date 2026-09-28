import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/config/prisma';

describe('Analytics API', () => {
  const TEST_USER_ID = `usr_test_analytics_${Date.now()}`;

  beforeAll(async () => {
    // Seed data: some inside 24h, some outside
    const now = new Date();
    const olderThan24h = new Date(now.getTime() - 25 * 60 * 60 * 1000);
    
    await prisma.event.createMany({
      data: [
        { id: `an1_${Date.now()}`, userId: TEST_USER_ID, eventType: 'test_analytics_event', payload: {}, timestamp: now },
        { id: `an2_${Date.now()}`, userId: TEST_USER_ID, eventType: 'test_analytics_event', payload: {}, timestamp: now },
        { id: `an3_${Date.now()}`, userId: TEST_USER_ID, eventType: 'test_analytics_old', payload: {}, timestamp: olderThan24h },
      ],
    });
  });

  afterAll(async () => {
    await prisma.event.deleteMany({
      where: { userId: TEST_USER_ID },
    });
    await prisma.$disconnect();
  });

  describe('GET /api/events/analytics', () => {
    it('should return analytics successfully and only include last 24 hours', async () => {
      const res = await request(app).get('/api/events/analytics');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.totalEvents).toBeGreaterThanOrEqual(2);
      expect(res.body.data.eventCountsByType).toBeInstanceOf(Array);
      expect(res.body.data.timeWindow).toBeDefined();
      
      const counts = res.body.data.eventCountsByType;
      
      // Should find the recent events
      const recentEventCount = counts.find((c: any) => c.eventType === 'test_analytics_event');
      expect(recentEventCount).toBeDefined();
      expect(recentEventCount.count).toBeGreaterThanOrEqual(2);

      // Should NOT find the old events
      const oldEventCount = counts.find((c: any) => c.eventType === 'test_analytics_old');
      expect(oldEventCount).toBeUndefined();
    });
  });
});
