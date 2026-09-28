import { prisma } from '../src/config/prisma';

async function main() {
  const now = new Date();

  const hourAgo = (hours: number) => new Date(now.getTime() - hours * 60 * 60 * 1000);

  const daysAgo = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  const events = [
    // =========================
    // LOGIN EVENTS - 8
    // =========================
    {
      id: 'evt-login-001',
      userId: 'user-001',
      eventType: 'login',
      payload: {
        device: 'Chrome',
        platform: 'macOS',
        ip: '192.168.1.10',
      },
      timestamp: hourAgo(1),
    },
    {
      id: 'evt-login-002',
      userId: 'user-002',
      eventType: 'login',
      payload: {
        device: 'Safari',
        platform: 'iOS',
        ip: '192.168.1.11',
      },
      timestamp: hourAgo(2),
    },
    {
      id: 'evt-login-003',
      userId: 'user-003',
      eventType: 'login',
      payload: {
        device: 'Chrome',
        platform: 'Windows',
        ip: '192.168.1.12',
      },
      timestamp: hourAgo(3),
    },
    {
      id: 'evt-login-004',
      userId: 'user-001',
      eventType: 'login',
      payload: {
        device: 'Firefox',
        platform: 'Linux',
        ip: '192.168.1.13',
      },
      timestamp: hourAgo(5),
    },
    {
      id: 'evt-login-005',
      userId: 'user-004',
      eventType: 'login',
      payload: {
        device: 'Chrome',
        platform: 'Android',
        ip: '192.168.1.14',
      },
      timestamp: hourAgo(7),
    },
    {
      id: 'evt-login-006',
      userId: 'user-005',
      eventType: 'login',
      payload: {
        device: 'Safari',
        platform: 'iOS',
        ip: '192.168.1.15',
      },
      timestamp: hourAgo(10),
    },
    {
      id: 'evt-login-007',
      userId: 'user-006',
      eventType: 'login',
      payload: {
        device: 'Chrome',
        platform: 'Windows',
        ip: '192.168.1.16',
      },
      timestamp: hourAgo(15),
    },
    {
      id: 'evt-login-008',
      userId: 'user-007',
      eventType: 'login',
      payload: {
        device: 'Chrome',
        platform: 'macOS',
        ip: '192.168.1.17',
      },
      timestamp: hourAgo(20),
    },

    // =========================
    // PURCHASE EVENTS - 6
    // =========================
    {
      id: 'evt-purchase-001',
      userId: 'user-008',
      eventType: 'purchase',
      payload: {
        product: 'MacBook Pro',
        amount: 250000,
        currency: 'NPR',
      },
      timestamp: hourAgo(2),
    },
    {
      id: 'evt-purchase-002',
      userId: 'user-009',
      eventType: 'purchase',
      payload: {
        product: 'iPhone 17',
        amount: 150000,
        currency: 'NPR',
      },
      timestamp: hourAgo(4),
    },
    {
      id: 'evt-purchase-003',
      userId: 'user-010',
      eventType: 'purchase',
      payload: {
        product: 'AirPods Pro',
        amount: 40000,
        currency: 'NPR',
      },
      timestamp: hourAgo(6),
    },
    {
      id: 'evt-purchase-004',
      userId: 'user-011',
      eventType: 'purchase',
      payload: {
        product: 'Mechanical Keyboard',
        amount: 12000,
        currency: 'NPR',
      },
      timestamp: hourAgo(9),
    },
    {
      id: 'evt-purchase-005',
      userId: 'user-012',
      eventType: 'purchase',
      payload: {
        product: 'Monitor',
        amount: 45000,
        currency: 'NPR',
      },
      timestamp: hourAgo(12),
    },
    {
      id: 'evt-purchase-006',
      userId: 'user-013',
      eventType: 'purchase',
      payload: {
        product: 'Gaming Mouse',
        amount: 8000,
        currency: 'NPR',
      },
      timestamp: hourAgo(18),
    },

    // =========================
    // LOGOUT EVENTS - 4
    // =========================
    {
      id: 'evt-logout-001',
      userId: 'user-001',
      eventType: 'logout',
      payload: {
        sessionDuration: 3600,
      },
      timestamp: hourAgo(3),
    },
    {
      id: 'evt-logout-002',
      userId: 'user-002',
      eventType: 'logout',
      payload: {
        sessionDuration: 5400,
      },
      timestamp: hourAgo(8),
    },
    {
      id: 'evt-logout-003',
      userId: 'user-003',
      eventType: 'logout',
      payload: {
        sessionDuration: 2400,
      },
      timestamp: hourAgo(14),
    },
    {
      id: 'evt-logout-004',
      userId: 'user-004',
      eventType: 'logout',
      payload: {
        sessionDuration: 7200,
      },
      timestamp: hourAgo(22),
    },

    // =========================
    // SIGNUP EVENTS - 2
    // =========================
    {
      id: 'evt-signup-001',
      userId: 'user-014',
      eventType: 'signup',
      payload: {
        method: 'email',
        source: 'landing-page',
      },
      timestamp: hourAgo(11),
    },
    {
      id: 'evt-signup-002',
      userId: 'user-015',
      eventType: 'signup',
      payload: {
        method: 'google',
        source: 'referral',
      },
      timestamp: hourAgo(19),
    },

    // =========================
    // OLDER EVENTS
    // These should NOT appear
    // in "last 24 hours" analytics
    // =========================
    {
      id: 'evt-old-001',
      userId: 'user-020',
      eventType: 'login',
      payload: {
        device: 'Chrome',
        platform: 'Windows',
      },
      timestamp: daysAgo(2),
    },
    {
      id: 'evt-old-002',
      userId: 'user-021',
      eventType: 'purchase',
      payload: {
        product: 'Old Product',
        amount: 5000,
        currency: 'NPR',
      },
      timestamp: daysAgo(3),
    },
    {
      id: 'evt-old-003',
      userId: 'user-022',
      eventType: 'logout',
      payload: {
        sessionDuration: 1800,
      },
      timestamp: daysAgo(4),
    },
    {
      id: 'evt-old-004',
      userId: 'user-023',
      eventType: 'signup',
      payload: {
        method: 'email',
        source: 'old-campaign',
      },
      timestamp: daysAgo(7),
    },
  ];

  await prisma.event.deleteMany();

  await prisma.event.createMany({
    data: events,
  });

  console.log(`Seeded ${events.length} events.`);
}

main()
  .catch((error) => {
    console.error('Failed to seed database:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
