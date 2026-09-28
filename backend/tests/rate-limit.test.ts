import request from 'supertest';
import app from '../src/app';

describe('Rate Limiter', () => {
  it('should return 429 after exceeding the configured limit of 30 req/min', async () => {
    let got429 = false;

    for (let i = 0; i < 35; i++) {
      const res = await request(app).get('/api/events').query({ limit: 1 });
      if (res.status === 429) {
        got429 = true;
        expect(res.body.success).toBe(false);
        expect(res.body.message).toContain('Too many requests');
        break;
      }
    }

    expect(got429).toBe(true);
  });
});
